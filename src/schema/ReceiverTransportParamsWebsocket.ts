
/**
 * Describes WebSocket Receiver transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. WebSocket Receivers must support all parameters in this schema.
 */
export type ReceiverTransportParamsWebsocket = {
    
    /**
     * URI hosting the WebSocket server as defined in RFC 6455 Section 3. A null value indicates that the receiver has not yet been configured.
     */
    connection_uri? : string | null,
    
    /**
     * Indication of whether authorization is required to make a connection. If the parameter is set to auto the Receiver should establish for itself whether authorization should be used, based on its own internal configuration.
     */
    connection_authorization? : string | boolean
};