import Web3 from "web3";
import { BUILDER_NOT_SUPPORTED_ERROR, fetchConfig, getBlastBuilderUrl, isBuilderSupported } from "../utils/utils";
import { BlastConfig, BlastNetwork } from "../utils/types";
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

    /** @public */
    constructor(config: BlastConfig) {
        this.builderUrl = getBlastBuilderUrl(config.network, config.projectId, 'https')
        this.network = config.network
    }

    /** @public */
    @checkBuilderSupported
    public async getTransaction(transactionHash: string) {
        const functionName = this.getTransaction.name
        const response = await fetch(`${this.builderUrl}/getTransaction?transactionHash=${transactionHash}`, fetchConfig)
        const result = await response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getBlockTransactions(blockNumberOrHash: string) {
        const functionName = this.getBlockTransactions.name
        const url = `${this.builderUrl}/${functionName}?blockNumberOrHash=${blockNumberOrHash}`
        const response = await fetch(url, fetchConfig)
        const result = response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenMetadata(contractAddress: string) {
        const functionName = this.getTokenMetadata.name
        const url = `${this.builderUrl}/${functionName}?contractAddress=${contractAddress}`
        const response = await fetch(url, fetchConfig)
        const result = response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenTransfers(contractAddress: string, fromBlock?: string | number, toBlock?: string | number, pageSize?: number, pageKey?: string) {
        // get function name
        const functionName = this.getTokenTransfers.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?contractAddress=${contractAddress}`,
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

        const functionName = this.getTokenMints.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?contractAddress=${contractAddress}`,
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

        const functionName = this.getTokenBurns.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?contractAddress=${contractAddress}`,
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

        const functionName = this.getTokenHolders.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?contractAddress=${contractAddress}`,
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
        const functionName = this.getTokenAllowance.name
        const url = `${this.builderUrl}/${functionName}?contract_address=${contractAddress}&owner_address=${ownerAddress}&spender_address=${spenderAddress}`
        const response = await fetch(url, fetchConfig)
        const result = response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getTokenApprovals(contractAddress: string, ownerAddress?: string, spenderAddress?: string, pageSize?: number, pageKey?: string) {

        const functionName = this.getTokenApprovals.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?contractAddress=${contractAddress}`,
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

        const functionName = this.getTokenSupply.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?contractAddress=${contractAddress}`,
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

        const functionName = this.getLogs.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}`,
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
        const functionName = this.getBlockReceipts.name
        const url = `${this.builderUrl}/${functionName}?blockNumberOrHash=${blockNumberOrHash}`
        const response = await fetch(url, fetchConfig)
        const result = response.json()
        return result
    }

    /** @public */
    @checkBuilderSupported
    public async getWalletTokenAllowance(walletAddress: string, contractAddress?: string, pageSize?: number, pageKey?: string) {

        const functionName = this.getWalletTokenAllowance.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?walletAddress=${walletAddress}`,
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

        const functionName = this.getWalletTokenBalances.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?walletAddress=${walletAddress}`,
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

        const functionName = this.getWalletTokenHistory.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?walletAddress=${walletAddress}`,
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

        const functionName = this.getWalletTokenTransfers.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?walletAddress=${walletAddress}`,
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
        console.log(url)
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
        // Build the components
        const functionName = this.getWalletTransactions.name
        const urlComponents = [
            this.builderUrl,
            `/${functionName}?walletAddress=${walletAddress}`,
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