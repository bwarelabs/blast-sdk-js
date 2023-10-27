import Web3 from "web3";
import { BUILDER_NOT_SUPPORTED_ERROR, fetchConfig, getBlastBuilderUrl, isBuilderSupported } from "../utils/utils";
import { BlastConfig, BlastNetwork, HashMap, RequestData } from "../utils/types";
import { RequestsHandler } from "./requests-handler";
const { Subject } = require('await-notify');

function checkBuilderSupported(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Capture original method
    const originalMethod = descriptor.value;

    // Call the function with the arguments
    descriptor.value = async function (...args: any[]) {
        // Cast to Builder class to access members
        const weakThis = this as Builder;

        // Check if the network is supported
        if (!isBuilderSupported(weakThis.network)) {
            throw new Error(BUILDER_NOT_SUPPORTED_ERROR);
        }

        // Call the original method
        const result = await originalMethod.call(this, ...args);
        return result;
    };
    // Set name to conform to the original method
    Object.defineProperty(descriptor.value, 'name', { value: propertyKey })
    return descriptor;
}

/** @internal */
export class Builder {

    readonly builderUrl: string;
    readonly network: BlastNetwork;
    private readonly requestsHandler?: RequestsHandler;
    /** @public */
    constructor(config: BlastConfig, requestsHandler?: RequestsHandler) {
        this.builderUrl = getBlastBuilderUrl(config.network, config.projectId, 'https')
        this.network = config.network
        this.requestsHandler = requestsHandler
    }

    /** @public */
    @checkBuilderSupported
    public async getTransaction(transactionHash: string) {
        const response = await fetch(`${this.builderUrl}/getTransaction?transactionHash=${transactionHash}`, fetchConfig)
        const result = await response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getBlockTransactions(blockNumberOrHash: string) {
        const url = `${this.builderUrl}/getBlockTransactions?blockNumberOrHash=${blockNumberOrHash}`
        const response = await fetch(url, fetchConfig)
        const result = response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenMetadata(contractAddress: string) {
        const url = `${this.builderUrl}/getTokenMetadata?contractAddress=${contractAddress}`
        const response = await fetch(url, fetchConfig)
        const result = response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenTransfers(contractAddress: string, fromBlock?: string | number, toBlock?: string | number, pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getTokenTransfers?contractAddress=${contractAddress}`,
            fromBlock ? `&fromBlock=${fromBlock}` : '',
            toBlock ? `&toBlock=${toBlock}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenMints(contractAddress: string, fromBlock?: string | number, toBlock?: string | number, toAddress?: string, pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getTokenMints?contractAddress=${contractAddress}`,
            fromBlock ? `&fromBlock=${fromBlock}` : '',
            toBlock ? `&toBlock=${toBlock}` : '',
            toAddress ? `&toAddress=${toAddress}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenBurns(contractAddress: string, fromBlock?: string | number, toBlock?: string | number, fromAddress?: string, pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getTokenBurns?contractAddress=${contractAddress}`,
            fromBlock ? `&fromBlock=${fromBlock}` : '',
            toBlock ? `&toBlock=${toBlock}` : '',
            fromAddress ? `&fromAddress=${fromAddress}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenHolders(contractAddress: string, blockNumber?: string | number, pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getTokenHolders?contractAddress=${contractAddress}`,
            blockNumber ? `&blockNumber=${blockNumber}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenAllowance(contractAddress: string, ownerAddress: string, spenderAddress: string) {
        const url = `${this.builderUrl}/getTokenAllowance?contractAddress=${contractAddress}&ownerAddress=${ownerAddress}&spenderAddress=${spenderAddress}`
        const response = await fetch(url, fetchConfig)
        const result = response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenApprovals(contractAddress: string, ownerAddress?: string, spenderAddress?: string, pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getTokenApprovals?contractAddress=${contractAddress}`,
            ownerAddress ? `&ownerAddress=${ownerAddress}` : '',
            spenderAddress ? `&spenderAddress=${spenderAddress}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenSupply(contractAddress: string, blockNumber?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getTokenSupply?contractAddress=${contractAddress}`,
            blockNumber ? `&blockNumber=${blockNumber}` : '',
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getLogs(fromBlock?: string | number, toBlock?: string | number, blockHash?: string, contractAddress?: string, topic0?: string, topic1?: string, topic2?: string, topic3?: string, pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getLogs`,
            fromBlock ? `?fromBlock=${fromBlock}` : '',
            toBlock ? `&toBlock=${toBlock}` : '',
            blockHash ? `&blockHash=${blockHash}` : '',
            contractAddress ? `&contractAddress=${contractAddress}` : '',
            topic0 ? `&topic0=${topic0}` : '',
            topic1 ? `&topic1=${topic1}` : '',
            topic2 ? `&topic2=${topic2}` : '',
            topic3 ? `&topic3=${topic3}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getBlockReceipts(blockNumberOrHash: string) {
        const url = `${this.builderUrl}/getBlockReceipts?blockNumberOrHash=${blockNumberOrHash}`
        const response = await fetch(url, fetchConfig)
        const result = response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getWalletTokenAllowance(walletAddress: string, contractAddress?: string, pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getWalletTokenAllowance?walletAddress=${walletAddress}`,
            contractAddress ? `&contractAddress=${contractAddress}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getWalletTokenBalances(walletAddress: string, contractAddresses?: string[], pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getWalletTokenBalances?walletAddress=${walletAddress}`,
            contractAddresses ? `&contractAddresses=${contractAddresses}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getWalletTokenHistory(walletAddress: string, blockNumber?: string, pageSize?: number, pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getWalletTokenHistory?walletAddress=${walletAddress}`,
            blockNumber ? `&blockNumber=${blockNumber}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getWalletTokenTransfers(
        walletAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        contractAddress?: string,
        secondWalletAddress?: string,
        onlyIncoming: boolean = false,
        onlyOutgoing: boolean = false,
        pageSize?: number,
        pageKey?: string) {
        const urlComponents = [
            this.builderUrl,
            `/getWalletTokenTransfers?walletAddress=${walletAddress}`,
            fromBlock ? `&fromBlock=${fromBlock}` : '',
            toBlock ? `&toBlock=${toBlock}` : '',
            contractAddress ? `&contractAddress=${contractAddress}` : '',
            secondWalletAddress ? `&secondWalletAddress=${secondWalletAddress}` : '',
            onlyIncoming ? `&onlyIncoming=${onlyIncoming}` : '',
            onlyOutgoing ? `&onlyOutgoing=${onlyOutgoing}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

    /** @public */
    @checkBuilderSupported
    public async getWalletTransactions(
        walletAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        secondWalletAddress?: string,
        onlyIncoming: boolean = false,
        onlyOutgoing: boolean = false,
        pageSize?: number,
        pageKey?: string
    ) {
        const urlComponents = [
            this.builderUrl,
            `/getWalletTransactions?walletAddress=${walletAddress}`,
            fromBlock ? `&fromBlock=${fromBlock}` : '',
            toBlock ? `&toBlock=${toBlock}` : '',
            secondWalletAddress ? `&secondWalletAddress=${secondWalletAddress}` : '',
            onlyIncoming ? `&onlyIncoming=${onlyIncoming}` : '',
            onlyOutgoing ? `&onlyOutgoing=${onlyOutgoing}` : '',
            pageSize ? `&pageSize=${pageSize}` : '',
            pageKey ? `&pageKey=${pageKey}` : ''
        ];

        const url = urlComponents.join('');
        const response = await fetch(url, fetchConfig);
        const result = response.json();
        return result;
    }

}