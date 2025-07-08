import { ianaToWindowsMap, windowsToIanaMap } from './timezone-data';
import { NonEmptyArray } from './types';

/**
 * Finds the Windows timezone equivalent for an IANA timezone identifier.
 *
 * @example
 * ```typescript
 * findWindowsFromIana('America/New_York') // 'Eastern Standard Time'
 * findWindowsFromIana('Invalid/Timezone') // undefined
 * ```
 */
export function findWindowsFromIana(ianaTimezone: string): string | undefined {
    return ianaToWindowsMap[ianaTimezone];
}

/**
 * Finds the IANA timezone equivalents for a Windows timezone.
 *
 * @example
 * ```typescript
 * findIanaFromWindows('Eastern Standard Time') // ['America/New_York', 'America/Toronto', ...]
 * findIanaFromWindows('Invalid Timezone') // undefined
 * ```
 */
export function findIanaFromWindows(
    windowsTimezone: string,
): NonEmptyArray<string> | undefined {
    return windowsToIanaMap[windowsTimezone];
}
