import {BlastSubscriptionPlan, HashMap, Request} from "../utils/types";
import {Queue} from "queue-typescript";
import {NOT_STARTED, RATE_LIMIT_ERROR, WINDOW_LENGTH_IN_MILLISECONDS} from "../utils/utils";

/** @internal */
export class RequestsHandler {
    private readonly plan: BlastSubscriptionPlan | number;
    private readonly queue: Queue<Request>;
    requestEvent: HashMap;
    private queueAlreadyRunning: boolean;

    private currentWindowStartTime: number;
    private currentWindowNumberOfRequests: number;
    private previousWindowNumberOfRequests: number;

    /** @internal */
    constructor(plan: BlastSubscriptionPlan | number, requestEvent: HashMap) {
        this.plan = plan;
        this.requestEvent = requestEvent;

        this.queue = new Queue<Request>();
        this.queueAlreadyRunning = false;

        this.currentWindowStartTime = NOT_STARTED;
        this.previousWindowNumberOfRequests = 0;
        this.currentWindowNumberOfRequests = 0;
    }

    /** @internal */
    enqueue(request: Request) {
        this.queue.enqueue(request);
        this.resolveRequestQueue().then();
    }

    /** @internal */
    handleErrors(request: Request, err: any) {
        if (err.message === RATE_LIMIT_ERROR) {
            this.enqueue(request);
        } else {
            console.error(err);
            request.callback(err, undefined);
            this.requestEvent[request.requestId].event.notify();
        }
    }

    /** @internal */
    async resolveRequestQueue() {
        if (this.queueAlreadyRunning) {
            return;
        }
        this.queueAlreadyRunning = true;

        while (this.queue.length > 0) {
            const request: Request = this.queue.dequeue();

            if (request.parent.requests !== undefined) {
                // if parent is BatchRequest
                const numberOfSubRequests = request.parent.requests.length;
                if (numberOfSubRequests > this.plan) {
                    console.error(`The number of sub requests (${numberOfSubRequests}) within one batch request exceeds the plan (${this.plan}).`);
                }

                await this.handleRateLimit(numberOfSubRequests);

                request.originalFunction.apply(request.parent, request.arguments);
                this.requestEvent[request.requestId].event.notify();
            } else {
                // if parent is Eth
                await this.handleRateLimit(1);

                request.originalFunction.apply(request.parent, request.arguments)
                    .then((response: any) => {
                        request.callback(null, response);
                        this.requestEvent[request.requestId].response = response;
                        this.requestEvent[request.requestId].event.notify();
                    })
                    .catch((err: any) => this.handleErrors(request, err));
            }
        }

        this.queueAlreadyRunning = false;
    }

    /** @internal */
    private async handleRateLimit(numberOfRequests: number) {
        const currentTime: number = Date.now();
        if (this.currentWindowStartTime == NOT_STARTED) {
            this.currentWindowStartTime = currentTime;
        }

        let currentWindowDuration: number = currentTime - this.currentWindowStartTime;
        if (currentWindowDuration > WINDOW_LENGTH_IN_MILLISECONDS) {
            if (currentWindowDuration >= 2 * WINDOW_LENGTH_IN_MILLISECONDS) {
                this.previousWindowNumberOfRequests = 0;
            } else {
                this.previousWindowNumberOfRequests = this.currentWindowNumberOfRequests;
            }

            currentWindowDuration %= WINDOW_LENGTH_IN_MILLISECONDS;
            this.currentWindowStartTime = currentTime - currentWindowDuration;

            this.currentWindowNumberOfRequests = 0;
        }

        const scale: number = (WINDOW_LENGTH_IN_MILLISECONDS - currentWindowDuration) / WINDOW_LENGTH_IN_MILLISECONDS;

        if (scale * this.previousWindowNumberOfRequests +
            (this.currentWindowNumberOfRequests + numberOfRequests) > this.plan) {
                await new Promise(resolve => setTimeout(resolve, Math.ceil(this.timeToWaitForNewRequest(numberOfRequests, currentTime))));

                // we moved to a different window, so we need to do the processing again
                await this.handleRateLimit(numberOfRequests);
                return;
            }
        // add current request to the number of requests
        this.currentWindowNumberOfRequests += numberOfRequests;
    }

    /** @internal */
    private timeToWaitForNewRequest(numberOfRequests: number, currentTime: number): number {
        if (this.previousWindowNumberOfRequests !== 0) {
            return WINDOW_LENGTH_IN_MILLISECONDS
                - (this.plan - (this.currentWindowNumberOfRequests + numberOfRequests))
                / this.previousWindowNumberOfRequests * WINDOW_LENGTH_IN_MILLISECONDS
                + this.currentWindowStartTime
                - currentTime;
        } else {
            return WINDOW_LENGTH_IN_MILLISECONDS + this.currentWindowStartTime + 1 - currentTime;
        }
    }
}
