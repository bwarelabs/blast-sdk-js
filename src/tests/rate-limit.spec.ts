import { BlastNetwork } from "../utils/types";
import { Blast } from "../api/blast";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
const { Subject } = require('await-notify');

describe('Test automatic back-off when rate limit is reached', () => {
    function createRegularRequestArray(blast: Blast, requestNumber: number) {
        const requests = [];
        for (let i = 0; i < requestNumber; ++i) {
            requests.push(blast.apiProvider.eth.getGasPrice().should.eventually.not.equal(undefined));
        }
        return requests;
    }

    function createBuilderRequestArray(blast: Blast, requestNumber: number) {
        const requests = [];
        for (let i = 0; i < requestNumber; ++i) {
            requests.push(blast.builder.getTransaction('0x067ce4942cb3c65fe74e21063c35f786eb666712ba5d074d2dff56a6d28c1ba3').should.eventually.have.property('blockNumber'));
        }
        return requests;
    }

    before(() => {
        chai.use(chaiAsPromised);
        chai.config.showDiff = true;
        chai.config.truncateThreshold = 0;
        chai.should();
    });

    // wait for the sliding window to clear up
    beforeEach(() => new Promise((resolve) => setTimeout(resolve, 2000)));

    it('test rate limit for custom 100 plan', () => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            rateLimit: 100,
        });
        return Promise.all(createRegularRequestArray(blast, 500));
    }).timeout(20000);

    it('test rate limit for custom 100 plan for builder', async () => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            rateLimit: 100,
        });
        return Promise.all(createBuilderRequestArray(blast, 500));
    }).timeout(20000);

    it('test rate limit for batch requests', () => {
        const blast: Blast = new Blast({
            projectId: process.env.PROJECT_ID_CUSTOM_PLAN_100 as string,
            network: BlastNetwork.ETH_MAINNET,
            rateLimit: 100,
        });

        const subjects = [];
        for (let k = 0; k < 10; ++k) {
            const batch = new blast.apiProvider.BatchRequest();

            for (let i = 0; i < (k < 5 ? 70 : 100); i++) {
                const subject = new Subject();
                // @ts-ignore because typescript doesn't see the |request| property
                batch.add(blast.apiProvider.eth.getGasPrice.request(() => subject.notify()));
                subjects.push(subject);
            }

            batch.execute();
        }

        return Promise.all(subjects.map(subject => subject.wait()));
    }).timeout(30000);
});
