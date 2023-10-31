const { Subject } = require('await-notify');

/** @internal */
export type ConnectionType = 'https' | 'wss';

/**
 * Config for intializing a Blast instance.
 * @public
 */
export interface BlastConfig {
    /**
     * The project id of your Blast project.
     */
    projectId: string;
    /**
     * The network you want to connect to.
     */
    network: BlastNetwork;
    /**
     * Can be the plan you are subscribed to (BlastSubscriptionPlan) or the
     * maximum number of requests per second your plan allows (useful
     * especially for custom plans) or undefined (if you don't want the SDK to
     * delay/retry your requests so that you don't get the 'Rate Limit Reached'
     * error).
     */
    rateLimit: BlastSubscriptionPlan | number | undefined;
}

/** @public */
export enum BlastNetwork {
    ETH_MAINNET = 'eth-mainnet',
    ETH_SEPOLIA = 'eth-sepolia',
    ETH_GOERLI = 'eth-goerli',
    BSC_TESTNET = 'bsc-testnet',
    BSC_MAINNET = 'bsc-mainnet',
    MOONBEAM_MAINNET = 'moonbeam',
    MOONRIVER_MAINNET = 'moonriver',
    MOONBASE_ALPHA = 'moonbase-alpha',
    SHIDEN_SHIBUYA = 'shibuya',
    SHIDEN_MAINNET = 'shiden',
    FANTOM_TESTNET = 'fantom-testnet',
    FANTOM_MAINNET = 'fantom-mainnet',
    POLYGON_TESTNET = 'polygon-testnet',
    POLYGON_MAINNET = 'polygon-mainnet',
    ASTAR_MAINNET = 'astar',
    GNOSIS_MAINNET = 'gnosis-mainnet',
    OPTIMISM_MAINNET = 'optimism-mainnet',
    OPTIMISM_GOERLI = 'optimism-goerli',
    PALM_MAINNET = 'palm-mainnet',
    PALM_TESTNET = 'palm-testnet',
    EVMOS_MAINNET = 'evmos-mainnet',
    // new supported networks
    ARBITUM_ONE = 'arbitrum-one',
    ARBITUM_GOERLI = 'arbitrum-goerli',
    ARBITUM_SEPOLIA = 'arbitrum-sepolia',
    ARBITUM_NOVA = 'arbitrum-nova',
    SCROLL_MAINNET = 'scroll-mainnet',
    SCROLL_ALPHANET = 'scroll-alphanet',
    SCROLL_SEPOLIA = 'scroll-sepolia',
    BASE_MAINNET = 'base-mainnet',
    BASE_GOERLI = 'base-goerli',
    METIS_MAINNET = 'metis-mainnet',
    OKTC_MAINNET = 'oktc-mainnet',
    MANTLE_MAINNET = 'mantle-mainnet',
    MANTLE_GOERLI = 'mantle-goerli',
    LINEA_MAINNET = 'linea-mainnet',
    LINEA_GOERLI = 'linea-goerli',
    // not supported networks only below
    // make sure that the list below is on part with the |NotSupportedNetworks| enum below
    STARKNET_TESTNET = 'starknet-testnet',
    STARKNET_MAINNET = 'starknet-mainnet',
    AVALANCHE_TESNTET = 'ava-testnet',
    AVALANCHE_MAINNET = 'ava-mainnet',
    ELROND_TESTNET = 'elrond-testnet',
    ELROND_MAINNET_API = 'elrond-api',
    ELROND_DEVNET_API = 'elrond-api-devnet',
    ELROND_MAINNET_GATEWAY = 'elrond-mainnet',
    APTOS_MAINNET = 'aptos-mainnet',
    APTOS_TESTNET = 'aptos-testnet',
    SUI_MAINNET = 'sui-mainnet',
    SUI_TESTNET = 'sui-testnet',
}
/** @public */
export enum BlastNetworkBuilderAPI {
    ETH_MAINNET = 'eth-mainnet',
    OPTIMISM_MAINNET = 'optimism-mainnet',
    ARBITUM_ONE = 'arbitrum-one',
    BASE_MAINNET = 'base-mainnet',
}

// make sure that all the enum entries below also exist in the |BlastNetwork| enum above
/** @internal */
export enum NotSupportedNetworks {
    STARKNET_TESTNET = 'starknet-testnet',
    STARKNET_MAINNET = 'starknet-mainnet',
    AVALANCHE_TESNTET = 'ava-testnet',
    AVALANCHE_MAINNET = 'ava-mainnet',
    ELROND_TESTNET = 'elrond-testnet',
    ELROND_MAINNET_API = 'elrond-api',
    ELROND_DEVNET_API = 'elrond-api-devnet',
    ELROND_MAINNET_GATEWAY = 'elrond-mainnet',
    APTOS_MAINNET = 'aptos-mainnet',
    APTOS_TESTNET = 'aptos-testnet',
    SUI_MAINNET = 'sui-mainnet',
    SUI_TESTNET = 'sui-testnet',
}

/**
 * Maximum number of requests per second for each plan.
 * @public
 */
export enum BlastSubscriptionPlan {
    Free = 40,
    Developer = 100,
    Startup = 400,
}

/** @internal */
export interface Request {
    originalFunction: any;
    parent: any;
    arguments: any[];
    callback: any;
    requestId: string;
}

/** @internal */
export interface RequestData {
    event: typeof Subject;
    response: any;
}

/** @internal */
export interface HashMap<T> {
    [key: string]: T;
}

/** @internal */
export const BUILDER_WEIGHTS: { [key: string]: number } = {
    'getTransaction': 1,
    'getBlockTransactions': 2,
    'getTokenMetadata': 1,
    'getTokenTransfers': 2,
    'getTokenMints': 1,
    'getTokenBurns': 2,
    'getTokenHolders': 3,
    'getTokenAllowance': 1,
    'getTokenApprovals': 2,
    'getTokenSupply': 1,
    'getLogs': 5,
    'getBlockReceipts': 3,
    'getWalletTokenAllowance': 4,
    'getWalletTokenBalances': 4,
    'getWalletTokenHistory': 5,
    'getWalletTokenTransfers': 4,
    'getWalletTransactions': 4,
}