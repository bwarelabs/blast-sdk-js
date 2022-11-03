import {BlastNetwork} from "../utils/types";
import {Blast} from "../api/blast";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";

describe('Test automatic back-off when rate limit is reached', () => {
    function createRequestArray(blast: Blast, requestNumber: number) {
        const requests = [];
        for (let i = 0; i < requestNumber; ++i) {
            requests.push(blast.apiProvider.eth.getGasPrice().should.eventually.not.equal(undefined));
        }
        return requests;
    }

    before(() => {
        chai.use(chaiAsPromised);
        chai.should();
    });

    // wait for the sliding window to clear up
    beforeEach(() => new Promise((resolve) => setTimeout(resolve, 2000)));

    it('test rate limit for custom 100 plan', () => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            plan: 100,
        });
        return Promise.all(createRequestArray(blast, 500));
    }).timeout(15000);
});
