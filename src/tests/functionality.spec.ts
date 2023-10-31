import { BlastConfig, BlastNetwork } from "../utils/types";
import * as chai from "chai";
import { Blast } from "../api/blast";
import { isNetworkSupported, NOT_SUPPORTED_ERROR, RATE_LIMIT_ERROR } from "../utils/utils";
import chaiAsPromised from "chai-as-promised";
const { Subject } = require('await-notify');

describe('Test functionality', () => {
    let expect: Chai.ExpectStatic;
    let originalProcessOn: any;

    before(() => {
        expect = chai.expect;
        chai.use(chaiAsPromised);
        chai.should();
        originalProcessOn = process.on;
    });

    // wait for the sliding window to clear up
    beforeEach(() => new Promise((resolve) => setTimeout(resolve, 2000)));
    afterEach(() => { process.on = originalProcessOn });

    it('supported networks should work both on https and wss while not supported networks should not', async () => {
        for (const network of Object.values(BlastNetwork)) {
            const config: BlastConfig = {
                projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
                network,
                rateLimit: 100,
            };

            try {
                const blast: Blast = new Blast(config);

                const gas1 = await blast.apiProvider.eth.getGasPrice();
                const gas2 = await blast.wsProvider.eth.getGasPrice();

                expect(+gas1).not.to.be.NaN;
                expect(+gas2).not.to.be.NaN;
            } catch (err) {
                try {
                    expect(isNetworkSupported(network)).to.be.false;
                    expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
                } catch (err) {
                    console.log('Network: ', network)
                    throw err
                }
            }
        }
    }).timeout(15000);

    it('methods with multiple arguments should work', async () => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            rateLimit: 100,
        });

        const result = await blast.apiProvider.eth.getTransactionFromBlock('latest', '0x0');
        // we test that the result object exists, and that it is populated
        expect(result.gas).to.be.a('number');
    });

    it('batch requests should work', () => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            rateLimit: 100,
        });

        const batch = new blast.apiProvider.BatchRequest();

        const subjects = [];
        for (let i = 0; i < 50; i++) {
            const subject = new Subject();
            // @ts-ignore because typescript doesn't see the |request| property
            batch.add(blast.apiProvider.eth.getGasPrice.request(() => subject.notify()));
            subjects.push(subject);
        }
        batch.execute();

        return Promise.all(subjects.map(subject => subject.wait()));
    });

    it('batch request with more requests than the plan should not work', (done) => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            rateLimit: 100,
        });

        // @ts-ignore because ts doesn't like this type of override
        process.on = ('uncaughtException', function () {
            done();
        });

        const batch = new blast.apiProvider.BatchRequest();

        for (let i = 0; i < 101; i++) {
            // @ts-ignore because typescript doesn't see the |request| property
            batch.add(blast.apiProvider.eth.getGasPrice.request());
        }

        batch.execute();
    });

    it('requests should work when rateLimit is undefined', async () => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            rateLimit: undefined,
        });
        const gas = await blast.apiProvider.eth.getGasPrice();

        expect(+gas).not.to.be.NaN;
    });
});
