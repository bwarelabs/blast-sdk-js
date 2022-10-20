import {BlastNetwork, ConnectionType} from "./types";

/** @internal */
export function getBlastUrl(network: BlastNetwork, projectId: string, type: ConnectionType): string {
    return `${type}://${network}.blastapi.io/${projectId}`;
}
