# Blast SDK

## Get started
1. Install the package
```
npm install @bwarelabs/blast-sdk-js
```
2. Initialize
```js
const config: BlastConfig = {
    projectId: '<insert-your-project-id-here>',
    network: BlastNetwork.ETH_MAINNET,
    rateLimit: BlastSubscriptionPlan.Free,
};
const blast = new Blast(config);
```

3. Ready to go!
```js
const gasPrice = await blast.apiProvider.eth.getGasPrice();
```

## Documentation
[https://docs.blastapi.io/blast-documentation/blast-sdk](https://docs.blastapi.io/blast-documentation/blast-sdk)

## Supported methods
The `Blast` object has 2 providers:
- `blast.apiProvider`
- `blast.wsProvider`

Both of them are wrappers over `Web3` ([web3js](https://web3js.readthedocs.io/en/v1.8.0/index.html)).

Therefore, they support the same calls as the `Web3` provider, for an easy integration with your app.

## Supported networks
The network specified in config must have this form `BlastNetwork.<network>` (ex: `BlastNetwork.ETH_MAINNET`).

The SDK currently supports the following networks:
- `ASTAR_MAINNET`
- `BSC_MAINNET`
- `BSC_TESTNET`
- `ETH_MAINNET`
- `ETH_SEPOLIA`
- `ETH_GOERLI`
- `EVMOS_MAINNET` 
- `GNOSIS_MAINNET`
- `FANTOM_MAINNET`
- `FANTOM_TESTNET`
- `MOONBASE_ALPHA`
- `MOONBEAM_MAINNET`
- `MOONRIVER_MAINNET`
- `OPTIMISM_MAINNET` 
- `OPTIMISM_GOERLI` 
- `PALM_MAINNET` 
- `PALM_TESTNET` 
- `POLYGON_MAINNET `
- `POLYGON_TESTNET` 
- `SHIDEN_MAINNET`
- `SHIDEN_SHIBUYA`
