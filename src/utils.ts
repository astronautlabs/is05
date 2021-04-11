import { TaiTimestamp } from '@1500cloud/taitimestamp';
import leapseconds from '@1500cloud/taitimestamp/dist/leapseconds';
import * as tai from '@1500cloud/taitimestamp';

export function taiTimestampToJsTime(tai : TaiTimestamp): number {
    let { seconds, nanosecs } = tai;
    let utcSeconds = seconds;
    for (let i = leapseconds.length; i >= 0; --i) {
        if (leapseconds[i] <= utcSeconds - i) {
            utcSeconds -= (i + 1);
            break;
        }
    }

    return utcSeconds * 1000 + Math.floor(nanosecs / 1000000);
}

/**
 * Determine how many UTC seconds away the given TAI interval is from now
 * @param interval 
 */
export function taiTimeoutToUTC(interval : TaiTimestamp): number {
    let now = tai.now();
    let activateTime = tai.add(now, interval);
    return taiTimestampToJsTime(activateTime) - Date.now();
}