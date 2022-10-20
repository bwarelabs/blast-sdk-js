/** @internal */
export type ConnectionType = 'https' | 'wss';

/** @public */
export interface BlastConfig {
    projectId: string;
    network: BlastNetwork;
}

/** @public */
export enum BlastNetwork {
    ETH_MAINNET = 'eth-mainnet',
    ETH_SEPOLIA = 'eth-sepolia',
    ETH_GOERLI = 'eth-goerli',
    BSC_TESTNET = 'bsc-testnet',
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
}