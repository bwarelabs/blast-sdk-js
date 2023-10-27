import { BlastConfig, BlastNetwork, BlastNetworkBuilderAPI, BlastSubscriptionPlan } from "../utils/types";
import * as chai from "chai";
import { Blast } from "../api/blast";
import { fetchConfig, isNetworkSupported, NOT_SUPPORTED_ERROR, RATE_LIMIT_ERROR } from "../utils/utils";
import chaiAsPromised from "chai-as-promised";
const { Subject } = require('await-notify');


describe('Test New Endponts', () => {
    let expect: Chai.ExpectStatic;
    let originalProcessOn: any;
    let blast: Blast;

    before(() => {
        expect = chai.expect;
        chai.use(chaiAsPromised);
        chai.should();
        originalProcessOn = process.on;

        const config: BlastConfig = {
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            rateLimit: BlastSubscriptionPlan.Free
        }

        blast = new Blast(config);

    });

    beforeEach(() => new Promise((resolve) => setTimeout(resolve, 2000)));
    afterEach(() => { process.on = originalProcessOn });

    it('Get Transaction', async () => {
        try {
            const object = await blast.builder.getTransaction('0x067ce4942cb3c65fe74e21063c35f786eb666712ba5d074d2dff56a6d28c1ba3')
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }

    }).timeout(15000);

    it('Get Block Transaction', async () => {
        try {
            const object = await blast.builder.getBlockTransactions('0x117af91')
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }

    }).timeout(15000);

    it('Get Wallet Transactions', async () => {
        try {
            const object = await blast.builder.getWalletTransactions(
                '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                '15000000',
                '16000000',
                undefined,
                true
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }

    }).timeout(15000);

    it('Get Token Metadata', async () => {
        try {
            const object = await blast.builder.getTokenMetadata('0x6b175474e89094c44da98b954eedeac495271d0f')
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    it('Get Token Transfers', async () => {
        try {
            const object = await blast.builder.getTokenTransfers(
                '0x6b175474e89094c44da98b954eedeac495271d0f',
                '15000000',
                '16000000',
                undefined,
                undefined
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    it('Get Token Mints', async () => {
        try {
            const object = await blast.builder.getTokenMints(
                '0x6b175474e89094c44da98b954eedeac495271d0f',
                '15000000',
                '16000000',
                undefined,
                undefined
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    it('Get Token Burns', async () => {
        try {
            const object = await blast.builder.getTokenBurns(
                '0x6b175474e89094c44da98b954eedeac495271d0f',
                '15000000',
                '16000000',
                undefined,
                undefined
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }

    }).timeout(15000);

    it('Get Token Holders', async () => {
        try {
            const object = await blast.builder.getTokenHolders(
                '0x6b175474e89094c44da98b954eedeac495271d0f',
                '15000000',
                undefined,
                undefined,
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    it('Get Token Allowance', async () => {
        try {
            const object = await blast.builder.getTokenAllowance(
                '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
                '0xf1a726210550c306a9964b251cbcd3fa5ecb275d',
                '0xdef1c0ded9bec7f1a1670819833240f027b25eff',
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    it('Get Token Approvals', async () => {
        try {
            const object = await blast.builder.getTokenApprovals(
                '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
                '0xf1a726210550c306a9964b251cbcd3fa5ecb275d',
                '0xdef1c0ded9bec7f1a1670819833240f027b25eff'
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    it('Get Token Suply', async () => {
        try {
            const object = await blast.builder.getTokenSupply(
                '0xdAC17F958D2ee523a2206206994597C13D831ec7'
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    it('Get Logs', async () => {
        try {
            const object = await blast.builder.getLogs(
                undefined,
                undefined,
                undefined,
                '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1')
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    it('Get Block Receipts', async () => {
        try {
            const object = await blast.builder.getBlockReceipts('0xc5043f')
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
        }
    }).timeout(15000);

    // Build test for getWalletTokenAllowance

    it('Get Wallet Token Allowance', async () => {
        try {
            const object = await blast.builder.getWalletTokenAllowance(
                '0xdAC17F958D2ee523a2206206994597C13D831ec7',
                '0x499b7CF87bE5883b02b18d206eA23D05adA8F2f7',
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(RATE_LIMIT_ERROR);
        }
    }).timeout(15000);

    it('Get Wallet Token Balances', async () => {
        try {
            const object = await blast.builder.getWalletTokenBalances(
                '0x499b7CF87bE5883b02b18d206eA23D05adA8F2f7',
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(RATE_LIMIT_ERROR);
        }
    }).timeout(15000);

    it('Get Wallet Token History', async () => {
        try {
            const object = await blast.builder.getWalletTokenHistory(
                '0x499b7CF87bE5883b02b18d206eA23D05adA8F2f7',
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(RATE_LIMIT_ERROR);
        }
    }).timeout(15000);

    it('Get Wallet Token Transfers', async () => {
        try {
            const object = await blast.builder.getWalletTokenTransfers(
                '0x499b7CF87bE5883b02b18d206eA23D05adA8F2f7',
            )
            expect(object).to.be.a('object')
        }
        catch (err) {
            expect((err as Error).message).to.equal(RATE_LIMIT_ERROR);
        }
    }).timeout(15000);

    it('')
});