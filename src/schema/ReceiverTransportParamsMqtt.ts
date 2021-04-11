
/**
 * Describes MQTT Receiver transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. MQTT Receivers must support all parameters in this schema.
 */
export type ReceiverTransportParamsMqtt = {
    
    /**
     * Hostname or IP hosting the MQTT broker. If the parameter is set to auto the Receiver should establish for itself which broker it should use, based on a discovery mechanism or its own internal configuration. A null value indicates that the Receiver has not yet been configured.
     */
    source_host? : string | null,
    
    /**
     * Source port for MQTT traffic. If the parameter is set to auto the Receiver should establish for itself which broker it should use, based on a discovery mechanism or its own internal configuration.
     */
    source_port? : number | string,
    
    /**
     * Indication of whether TLS is used for communication with the broker. 'mqtt' indicates operation without TLS, and 'secure-mqtt' indicates use of TLS. If the parameter is set to auto the Receiver should establish for itself which protocol it should use, based on a discovery mechanism or its own internal configuration.
     */
    broker_protocol? : string,
    
    /**
     * Indication of whether authorization is used for communication with the broker. If the parameter is set to auto the Receiver should establish for itself whether authorization should be used, based on a discovery mechanism or its own internal configuration.
     */
    broker_authorization? : string | boolean,
    
    /**
     * The topic which MQTT messages will be received from via the MQTT broker. A null value indicates that the Receiver has not yet been configured.
     */
    broker_topic? : string | null,
    
    /**
     * The topic used for MQTT status messages such as MQTT Last Will which are received via the MQTT broker. A null value indicates that the Receiver has not yet been configured, or is not using a connection status topic.
     */
    connection_status_broker_topic? : string | null
};