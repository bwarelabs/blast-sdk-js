import {BlastNetwork, ConnectionType} from "./types";

/** @internal */
export const WINDOW_LENGTH_IN_MILLISECONDS = 1000;
export const NOT_STARTED = -1;

/** @internal */
export function getBlastUrl(network: BlastNetwork, projectId: string, type: ConnectionType): string {
    return `${type}://${network}.blastapi.io/${projectId}`;
}
