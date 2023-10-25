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
            rateLimit: BlastSubscriptionPlan.Developer
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

    it('')
});