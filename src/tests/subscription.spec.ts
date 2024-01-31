import { BlastConfig, BlastNetwork, BlastSubscriptionPlan } from "../utils/types";
import * as chai from "chai";
import { Blast } from "../api/blast";
import chaiAsPromised from "chai-as-promised";
import { Subscription } from "web3-core-subscriptions";
import { BlockHeader } from "web3-eth";

describe('Test New Endponts', () => {
    let expect: Chai.ExpectStatic;
    let originalProcessOn: any;
    let blast: Blast;
    let subscription: Subscription<BlockHeader>;

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

    it('Check that the subscription connects', async () => {
        subscription = blast.wsProvider.eth.subscribe('newBlockHeaders')

        const prConnected = new Promise<void>((resolve, reject) => {
            subscription.on("connected", () => {
                resolve()
            })
        })

        await prConnected;
        chai.expect(prConnected).to.be.fulfilled;

        const prData = new Promise<void>((resolve, reject) => {
            subscription.on("data", (data) => {
                try {
                    chai.expect(data).to.have.property('timestamp')
                    chai.expect(data).to.have.property('hash')
                    console.log("New Block hash is: ", data.hash)
                    resolve()
                }
                catch (err) {
                    reject(err)
                }
            })
        })

        await prData;
        chai.expect(prData).to.be.fulfilled;

        const prUnsubscribed = new Promise<void>((resolve, reject) => {
            subscription.unsubscribe((error, success: any) => {
                if (!error) {
                    resolve()
                }
                else {
                    reject(error)
                }
            })
        })

        await prUnsubscribed;
        chai.expect(prUnsubscribed).to.be.fulfilled;

    }).timeout(60000)

    it('')
})