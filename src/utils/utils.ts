import { BlastNetwork, BlastNetworkBuilderAPI, ConnectionType, NotSupportedNetworks } from "./types";

/** @internal */
export const WINDOW_LENGTH_IN_MILLISECONDS = 1000;
/** @internal */
export const NOT_STARTED = -1;

/** @internal */
export const NOT_SUPPORTED_ERROR = 'Provided network is not supported';

/** @internal */
export const BUILDER_NOT_SUPPORTED_ERROR = 'Builder is not supported for this network';

/** @internal */
export const RATE_LIMIT_ERROR = 'Returned error: Rate limit reached';

/** @internal */
export function getBlastUrl(network: BlastNetwork, projectId: string, type: ConnectionType): string {
    return `${type}://${network}.blastapi.io/${projectId}`;
}

/** @internal */
export function getBlastBuilderUrl(network: BlastNetwork, projectId: string, type: ConnectionType): string {
    return `${type}://${network}.blastapi.io/${projectId}/builder`
}

/** @internal */
export function isNetworkSupported(network: BlastNetwork): boolean {
    return !Object.values(NotSupportedNetworks).includes(network as unknown as NotSupportedNetworks);
}

/** @internal */
export function isBuilderSupported(network: BlastNetwork) {
    return Object.values(BlastNetworkBuilderAPI).includes(network as unknown as BlastNetworkBuilderAPI);

}
/** @internal */
export const fetchConfig: Object = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': `BlastAPI-SDK/${process.env.npm_package_version} (${process.platform}) NodeJS/${process.version}`
    }
}