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
- `ARBITUM_GOERLI`
- `ARBITUM_ONE`
- `ARBITUM_NOVA`
- `ARBITUM_SEPOLIA`
- `ASTAR_MAINNET`
- `BASE_GOERLI`
- `BASE_MAINNET`
- `BSC_MAINNET`
- `BSC_TESTNET`
- `ETH_MAINNET`
- `ETH_SEPOLIA`
- `ETH_GOERLI`
- `EVMOS_MAINNET` 
- `FANTOM_MAINNET`
- `FANTOM_TESTNET`
- `GNOSIS_MAINNET`
- `LINEA_GOERLI`
- `LINEA_MAINNET`
- `MANTLE_GOERLI`
- `MANTLE_MAINNET`
- `METIS_MAINNET`
- `MOONBASE_ALPHA`
- `MOONBEAM_MAINNET`
- `MOONRIVER_MAINNET`
- `OKTC_MAINNET`
- `OPTIMISM_MAINNET` 
- `OPTIMISM_GOERLI` 
- `PALM_MAINNET` 
- `PALM_TESTNET` 
- `POLYGON_MAINNET`
- `POLYGON_TESTNET`
- `SCROLL_ALPHANET`
- `SCROLL_MAINNET`
- `SCROLL_SEPOLIA`
- `SHIDEN_MAINNET`
- `SHIDEN_SHIBUYA`

4. Builder API

In order to use the new builder api create the blast config as above and run one of the blast methods
```js
const config: BlastConfig = {
    projectId: '<insert-your-project-id-here>',
    network: BlastNetwork.ETH_MAINNET,
    rateLimit: BlastSubscriptionPlan.Free,
};
const blast = new Blast(config);
```

```js
const result = await blast.builder.getTransaction('0x067ce4942cb3c65fe74e21063c35f786eb666712ba5d074d2dff56a6d28c1ba3')
console.log(result)
```

The builder api works only on supported networks

## Builder API supported networks

The Builder API supports only the following networks:
- `ARBITUM_ONE`
- `BASE_MAINNET`
- `ETH_MAINNET`
- `OPTIMISM_MAINNET`