
/**
 * Parameters concerned with activation of the transport parameters
 */
export type ActivationSchema = {
    
    /**
     * Mode of activation: immediate (on message receipt), scheduled_absolute (when internal clock >= requested_time), scheduled_relative (when internal clock >= time of message receipt + requested_time), or null (no activation scheduled)
     */
    mode : string | null,
    
    /**
     * String formatted TAI timestamp (<seconds>:<nanoseconds>) indicating time (absolute or relative) for activation. Should be null or not present if 'mode' is null.
     */
    requested_time? : string | null
};