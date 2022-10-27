import {BlastConfig, BlastNetwork} from "../utils/types";
import * as chai from "chai";
import {Blast} from "../api/blast";
import {isNetworkSupported, NOT_SUPPORTED_ERROR} from "../utils/utils";
import chaiAsPromised from "chai-as-promised";

describe('Test networks', () => {
    let expect: Chai.ExpectStatic;

    before(() => {
        expect = chai.expect;
        chai.use(chaiAsPromised);
        chai.should();
    });

    it('supported networks should work both on https and wss while not supported networks should not', async () => {
        for (const network of Object.values(BlastNetwork)) {
            // there are issues with websockets on Evmos
            if (network === BlastNetwork.EVMOS_MAINNET) {
                continue;
            }
            const config: BlastConfig = {
                projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
                network,
                plan: 100,
            };

            try {
                const blast: Blast = new Blast(config);

                const gas1 = await blast.apiProvider.eth.getGasPrice();
                const gas2 = await blast.wsProvider.eth.getGasPrice();

                expect(+gas1).not.to.be.NaN;
                expect(+gas2).not.to.be.NaN;
            } catch (err) {
                expect(isNetworkSupported(network)).to.be.false;
                expect((err as Error).message).to.equal(NOT_SUPPORTED_ERROR);
            }
        }
    }).timeout(15000);

    it('methods with multiple arguments should work', async () => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            plan: 100,
        });

        const result = await blast.apiProvider.eth.getTransactionFromBlock('latest', '0x0');
        // we test that the result object exists, and that it is populated
        expect(result.gas).to.be.a('number');
    });

    it('batch requests should work', (done) => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            plan: 100,
        });


        const batch = new blast.apiProvider.BatchRequest();

        // @ts-ignore because typescript doesn't see the |request| property
        batch.add(blast.apiProvider.eth.getGasPrice.request(done()));

        batch.execute();
    });
});
