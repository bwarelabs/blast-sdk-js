import Web3 from "web3";
import {getBlastUrl, isNetworkSupported, NOT_SUPPORTED_ERROR} from "../utils/utils";
import {BlastConfig, HashMap} from "../utils/types";
import {Eth} from "web3-eth";
import {RequestsHandler} from "./requests-handler";
import {v4 as uuidv4} from "uuid";
const {Subject} = require('await-notify');

/** @public */
export class Blast {
    readonly apiProvider: Web3;
    readonly wsProvider: Web3;
    requestEvent: HashMap;
    requestsHandler: RequestsHandler;

    /** @public */
    constructor(config: BlastConfig) {
        if (!isNetworkSupported(config.network)) {
            throw new Error(NOT_SUPPORTED_ERROR);
        }
        this.apiProvider = new Web3(getBlastUrl(config.network, config.projectId, 'https'));
        this.wsProvider = new Web3(getBlastUrl(config.network, config.projectId, 'wss'));

        this.requestEvent = {};
        this.requestsHandler = new RequestsHandler(config.plan, this.requestEvent);

        // can be true or undefined
        if (config.handleRateLimit !== false) {
            this.wrapProviderToHandleRequestLimit(this.apiProvider);
            this.wrapProviderToHandleRequestLimit(this.wsProvider);
        }
    }

    /** @internal */
    private overrideFunctionToHandleRequestLimit(parent: any, originalFunction: any) {
        const weakThis = this;
        return async function () {
            const requestId = uuidv4();
            weakThis.requestEvent[requestId] = {event: new Subject(), response: undefined};

            let argumentsWithoutCallback = Array.from(arguments);
            let callback = () => {};

            if (arguments.length > 0) {
                const callbackFromArguments = arguments[arguments.length - 1];
                if (typeof callbackFromArguments === 'function') {
                    argumentsWithoutCallback = Array.from(arguments).slice(0, -1);
                    callback = callbackFromArguments;
                }
            }

            weakThis.requestsHandler.enqueue({
                originalFunction,
                parent,
                arguments: argumentsWithoutCallback,
                callback,
                requestId,
            });

            await weakThis.requestEvent[requestId].event.wait();
            return weakThis.requestEvent[requestId].response;
        }
    }

    /** @internal */
    private wrapFunctionToHandleRequestLimit(provider: Web3, func: keyof Eth) {
        const originalFunction = provider.eth[func];

        // @ts-ignore because it believes that func can be a property and not a function of the Eth class
        provider.eth[func] = this.overrideFunctionToHandleRequestLimit(provider.eth, originalFunction);

        // the functions have other properties too, like |web3.eth.getBalance()| also
        // has |web3.eth.getBalance.request| which we need to keep from the original
        // function
        for (const property of Object.getOwnPropertyNames(originalFunction)) {
            if (property !== 'name' && property !== 'length' && property !== 'prototype') {
                provider.eth[func][property] = originalFunction[property];
            }
        }
    }

    /** @internal */
    private wrapProviderToHandleRequestLimit(provider: Web3) {
        for (const notTypedFunc of Object.getOwnPropertyNames(provider.eth)) {
            const func = notTypedFunc as keyof Eth;
            const type = typeof (provider.eth[func]);

            if (type === 'function') {
                this.wrapFunctionToHandleRequestLimit(provider, func);
            }
        }

        const originalBatchRequest = provider.BatchRequest;
        const weakThis = this;

        // @ts-ignore because doesn't like this override
        provider.BatchRequest = function () {
            const batch = new originalBatchRequest();
            const originalExecute = batch.execute;

            batch.execute = function () {
                weakThis.overrideFunctionToHandleRequestLimit(batch, originalExecute)();
            };
            return batch;
        };
    }
}
