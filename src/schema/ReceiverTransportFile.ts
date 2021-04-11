
/**
 * Transport file parameters. 'data' and 'type' must both be strings or both be null. If 'type' is non-null 'data' is expected to contain a valid instance of the specified media type.
 */
export type ReceiverTransportFile = {
    
    /**
     * Content of the transport file
     */
    data : string | null,
    
    /**
     * IANA assigned media type for file (e.g application/sdp)
     */
    type : string | null
};