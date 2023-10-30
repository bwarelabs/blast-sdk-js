
import { BUILDER_NOT_SUPPORTED_ERROR, fetchConfig, getBlastBuilderUrl, isBuilderSupported } from "../utils/utils";
import { BUILDER_WEIGHTS, BlastConfig, BlastNetwork } from "../utils/types";

function builderApi(paramNames: string[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
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

            const url = `${weakThis.builderUrl}/${propertyKey}?${getQueryString(paramNames, args)}`;
            const response = await fetch(url, fetchConfig);
            const result = await response.json();
            if (result?.error) {
                throw result
            }
            return result;
        };
        // Set name to conform to the original method
        Object.defineProperty(descriptor.value, 'name', { value: propertyKey })
        Object.defineProperty(descriptor.value, 'weight', { value: BUILDER_WEIGHTS[propertyKey] })
        return descriptor;
    }
}

function getQueryString(paramNames: string[], args: any[]) {
    const queryString = args.reduce((acc, arg, index) => {
        if (arg) {
            acc.push(`${paramNames[index]}=${arg}`)
        }
        return acc
    }, [])

    return queryString.join('&')
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
    @builderApi(['transactionHash'])
    public async getTransaction(transactionHash: string): Promise<any> { }

    /** @public */
    @builderApi(['blockNumberOrHash'])
    public async getBlockTransactions(blockNumberOrHash: string): Promise<any> { }

    /** @public */
    @builderApi(['contractAddress'])
    public async getTokenMetadata(contractAddress: string): Promise<any> { }

    /** @public */
    @builderApi(['contractAddress', 'fromBlock', 'toBlock', 'pageSize', 'pageKey'])
    public async getTokenTransfers(
        contractAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['contractAddress', 'fromBlock', 'toBlock', 'toAddress', 'pageSize', 'pageKey'])
    public async getTokenMints(
        contractAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        toAddress?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['contractAddress', 'fromBlock', 'toBlock', 'fromAddress', 'pageSize', 'pageKey'])
    public async getTokenBurns(
        contractAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        fromAddress?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['contractAddress', 'blockNumber', 'pageSize', 'pageKey'])
    public async getTokenHolders(
        contractAddress: string,
        blockNumber?: string | number,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['contractAddress', 'ownerAddress', 'spenderAddress'])
    public async getTokenAllowance(
        contractAddress: string,
        ownerAddress: string,
        spenderAddress: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['contractAddress', 'fromBlock', 'toBlock', 'ownerAddress', 'spenderAddress', 'pageSize', 'pageKey'])
    public async getTokenApprovals(
        contractAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        ownerAddress?: string,
        spenderAddress?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['contractAddress', 'blockNumber'])
    public async getTokenSupply(contractAddress: string, blockNumber?: string): Promise<any> { }

    /** @public */
    @builderApi(['fromBlock', 'toBlock', 'blockHash', 'contractAddress', 'topic0', 'topic1', 'topic2', 'topic3', 'pageSize', 'pageKey'])
    public async getLogs(
        fromBlock?: string | number,
        toBlock?: string | number,
        blockHash?: string,
        contractAddress?: string,
        topic0?: string,
        topic1?: string,
        topic2?: string,
        topic3?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['blockNumberOrHash'])
    public async getBlockReceipts(blockNumberOrHash: string): Promise<any> { }

    /** @public */
    @builderApi(['walletAddress', 'contractAddress', 'pageSize', 'pageKey'])
    public async getWalletTokenAllowances(
        walletAddress: string,
        contractAddress?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['walletAddress', 'contractAddresses', 'pageSize', 'pageKey'])
    public async getWalletTokenBalances(
        walletAddress: string,
        contractAddresses?: string[],
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['walletAddress', 'blockNumber', 'pageSize', 'pageKey'])
    public async getWalletTokenHistory(
        walletAddress: string,
        blockNumber?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['walletAddress', 'fromBlock', 'toBlock', 'contractAddress', 'secondWalletAddress', 'onlyIncoming', 'onlyOutgoing', 'pageSize', 'pageKey'])
    public async getWalletTokenTransfers(
        walletAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        contractAddress?: string,
        secondWalletAddress?: string,
        onlyIncoming: boolean = false,
        onlyOutgoing: boolean = false,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }

    /** @public */
    @builderApi(['walletAddress', 'fromBlock', 'toBlock', 'secondWalletAddress', 'onlyIncoming', 'onlyOutgoing', 'pageSize', 'pageKey'])
    public async getWalletTransactions(
        walletAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        secondWalletAddress?: string,
        onlyIncoming: boolean = false,
        onlyOutgoing: boolean = false,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> { }
}