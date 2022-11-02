import {BlastSubscriptionPlan, HashMap, Request} from "../utils/types";
import {Queue} from "queue-typescript";
import {NOT_STARTED, WINDOW_LENGTH_IN_MILLISECONDS} from "../utils/utils";

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
    }

    /** @internal */
    async resolveRequestQueue() {
        if (this.queueAlreadyRunning) {
            return;
        }
        this.queueAlreadyRunning = true;

        while (this.queue.length > 0) {
            await this.handleRateLimit();

            const request: Request = this.queue.dequeue();
            request.originalFunction.apply(request.provider.eth, request.arguments).then((response: any) => {
                this.requestEvent[request.requestId].response = response;
            }).finally(() => {
                this.requestEvent[request.requestId].event.notify();
            });
        }

        this.queueAlreadyRunning = false;
    }

    /** @internal */
    private async handleRateLimit() {
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

        if (scale * this.previousWindowNumberOfRequests + (this.currentWindowNumberOfRequests + 1) > this.plan) {
            await new Promise(resolve => setTimeout(resolve, this.timeToWaitForNewRequest(currentTime)));

            // we moved to a different window, so we need to do the processing again
            await this.handleRateLimit();
            return;
        }
        // add current request to the number of requests
        ++this.currentWindowNumberOfRequests;
    }

    /** @internal */
    private timeToWaitForNewRequest(currentTime: number): number {
        if (this.previousWindowNumberOfRequests !== 0) {
            return WINDOW_LENGTH_IN_MILLISECONDS
                - (this.plan - (this.currentWindowNumberOfRequests + 1))
                / this.previousWindowNumberOfRequests * WINDOW_LENGTH_IN_MILLISECONDS
                + this.currentWindowStartTime
                - currentTime;
        } else {
            return WINDOW_LENGTH_IN_MILLISECONDS + this.currentWindowStartTime + 1 - currentTime;
        }
    }
}
