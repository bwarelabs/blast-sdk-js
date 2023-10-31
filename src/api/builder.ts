
import { BUILDER_NOT_SUPPORTED_ERROR, fetchConfig, getBlastBuilderUrl, isBuilderSupported } from "../utils/utils";
import { BUILDER_WEIGHTS, BlastConfig, BlastNetwork } from "../utils/types";

/** @internal */
function getQueryString(params: Object) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            if (Array.isArray(value)) {
                value.forEach((item: any) => {
                    queryParams.append(`${key}[]`, item.toString())
                })
            } else {
                queryParams.append(key, value.toString())
            }
        }
    })
    return queryParams
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
    /** @private */
    private async callBuilderApi(method: string, params: Object) {
        // Build url
        const url = `${this.builderUrl}/${method}?${getQueryString(params)}`;
        // Handle not supported error
        if (!isBuilderSupported(this.network)) {
            throw new Error(BUILDER_NOT_SUPPORTED_ERROR)
        }
        const response = await fetch(url, fetchConfig);
        const result = await response.json();
        if (result?.error) {
            throw result
        }
        return result;
    }

    /** @public */
    public async getTransaction(transactionHash: string): Promise<any> {
        return this.callBuilderApi('getTransaction', { transactionHash });
    }

    /** @public */
    public async getBlockTransactions(blockNumberOrHash: string): Promise<any> {
        return this.callBuilderApi('getBlockTransactions', { blockNumberOrHash });
    }

    /** @public */
    public async getTokenMetadata(contractAddress: string): Promise<any> {
        return this.callBuilderApi('getTokenMetadata', { contractAddress });
    }

    /** @public */
    public async getTokenTransfers(
        contractAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getTokenTransfers', { contractAddress, fromBlock, toBlock, pageSize, pageKey });
    }

    /** @public */
    public async getTokenMints(
        contractAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        toAddress?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getTokenMints', { contractAddress, fromBlock, toBlock, toAddress, pageSize, pageKey });
    }

    /** @public */
    public async getTokenBurns(
        contractAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        fromAddress?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getTokenBurns', { contractAddress, fromBlock, toBlock, fromAddress, pageSize, pageKey });
    }

    /** @public */
    public async getTokenHolders(
        contractAddress: string,
        blockNumber?: string | number,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getTokenHolders', { contractAddress, blockNumber, pageSize, pageKey });
    }

    /** @public */
    public async getTokenAllowance(
        contractAddress: string,
        ownerAddress: string,
        spenderAddress: string
    ): Promise<any> {
        return this.callBuilderApi('getTokenAllowance', { contractAddress, ownerAddress, spenderAddress });
    }

    /** @public */
    public async getTokenApprovals(
        contractAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        ownerAddress?: string,
        spenderAddress?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getTokenApprovals', { contractAddress, fromBlock, toBlock, ownerAddress, spenderAddress, pageSize, pageKey });
    }

    /** @public */
    public async getTokenSupply(contractAddress: string, blockNumber?: string): Promise<any> {
        return this.callBuilderApi('getTokenSupply', { contractAddress, blockNumber });
    }

    /** @public */
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
    ): Promise<any> {
        return this.callBuilderApi('getLogs', { fromBlock, toBlock, blockHash, contractAddress, topic0, topic1, topic2, topic3, pageSize, pageKey });
    }

    /** @public */
    public async getBlockReceipts(blockNumberOrHash: string): Promise<any> {
        return this.callBuilderApi('getBlockReceipts', { blockNumberOrHash });
    }

    /** @public */
    public async getWalletTokenAllowances(
        walletAddress: string,
        contractAddress?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getWalletTokenAllowances', { walletAddress, contractAddress, pageSize, pageKey });
    }

    /** @public */
    public async getWalletTokenBalances(
        walletAddress: string,
        contractAddresses?: string[],
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getWalletTokenBalances', { walletAddress, contractAddresses, pageSize, pageKey });
    }

    /** @public */
    public async getWalletTokenHistory(
        walletAddress: string,
        blockNumber?: string,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getWalletTokenHistory', { walletAddress, blockNumber, pageSize, pageKey });
    }

    /** @public */
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
    ): Promise<any> {
        return this.callBuilderApi('getWalletTokenTransfers', { walletAddress, fromBlock, toBlock, contractAddress, secondWalletAddress, onlyIncoming, onlyOutgoing, pageSize, pageKey });
    }

    /** @public */
    public async getWalletTransactions(
        walletAddress: string,
        fromBlock?: string | number,
        toBlock?: string | number,
        secondWalletAddress?: string,
        onlyIncoming: boolean = false,
        onlyOutgoing: boolean = false,
        pageSize?: number,
        pageKey?: string
    ): Promise<any> {
        return this.callBuilderApi('getWalletTransactions', { walletAddress, fromBlock, toBlock, secondWalletAddress, onlyIncoming, onlyOutgoing, pageSize, pageKey });
    }
}