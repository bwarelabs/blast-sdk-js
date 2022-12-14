const {Subject} = require('await-notify');

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
