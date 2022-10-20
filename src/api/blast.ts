import Web3 from "web3";
import {getBlastUrl} from "../utils/utils";
import {BlastConfig, HashMap, NotSupportedNetworks} from "../utils/types";
import {Eth} from "web3-eth";
import {RequestsHandler} from "./requests-handler";
const {v4} = require('uuid');
const {Subject} = require('await-notify');

/** @public */
export class Blast {
    readonly apiProvider: Web3;
    readonly wsProvider: Web3;
    requestEvent: HashMap;
    requestsHandler: RequestsHandler;

    /** @public */
    constructor(config: BlastConfig) {
        if (Object.values(NotSupportedNetworks).includes(config.network as unknown as NotSupportedNetworks)) {
            throw new Error('Provided network is not supported');
        }
        this.apiProvider = new Web3(getBlastUrl(config.network, config.projectId, 'https'));
        this.wsProvider = new Web3(getBlastUrl(config.network, config.projectId, 'wss'));

        this.requestEvent = {};
        this.requestsHandler = new RequestsHandler(config.plan, this.requestEvent);

        this.wrapProviderToHandleRequestLimit(this.apiProvider);
        this.wrapProviderToHandleRequestLimit(this.wsProvider);
    }

    /** @internal */
    private wrapFunctionToHandleRequestLimit(provider: Web3, func: keyof Eth) {
        const originalFunction = provider.eth[func];
        const weakThis = this;

        // @ts-ignore because it believes that func can be a property and not a function of the Eth class
        provider.eth[func] = async function () {
            const requestId = v4();
            weakThis.requestEvent[requestId] = {event: new Subject(), response: undefined};

            weakThis.requestsHandler.enqueue({originalFunction, provider, arguments, requestId});
            weakThis.requestsHandler.resolveRequestQueue().then();

            await weakThis.requestEvent[requestId].event.wait();
            return weakThis.requestEvent[requestId].response;
        };
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
    }
}