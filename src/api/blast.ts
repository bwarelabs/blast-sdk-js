import Web3 from "web3";
import {getBlastUrl} from "../utils/utils";
import {BlastConfig, NotSupportedNetworks} from "../utils/types";

/** @public */
export class Blast {
    readonly apiProvider: Web3;
    readonly wsProvider: Web3;

    /** @public */
    constructor(config: BlastConfig) {
        if (Object.values(NotSupportedNetworks).includes(config.network as unknown as NotSupportedNetworks)) {
            throw new Error('Provided network is not supported');
        }
        this.apiProvider = new Web3(getBlastUrl(config.network, config.projectId, 'https'));
        this.wsProvider = new Web3(getBlastUrl(config.network, config.projectId, 'wss'));
    }
}