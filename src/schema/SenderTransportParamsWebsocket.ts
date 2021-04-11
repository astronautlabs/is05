
/**
 * Describes WebSocket Sender transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. WebSocket Senders must support all parameters in this schema.
 */
export type SenderTransportParamsWebsocket = {
    
    /**
     * URI hosting the WebSocket server as defined in RFC 6455 Section 3. The sender should provide an enum in the constraints endpoint, which should contain the available interface addresses formatted as connection URIs. If the parameter is set to auto the sender should establish for itself which interface it should use, based on routing rules or its own internal configuration. A null value indicates that the sender has not yet been configured.
     */
    connection_uri? : string | null,
    
    /**
     * Indication of whether authorization is required to make a connection. If the parameter is set to auto the Sender should establish for itself whether authorization should be used, based on its own internal configuration.
     */
    connection_authorization? : string | boolean
};