
/**
 * Describes MQTT Sender transport parameters. The constraints in this schema are minimum constraints, but may be further constrained at the constraints endpoint. MQTT Senders must support all properties in this schema.
 */
export type SenderTransportParamsMqtt = {
    
    /**
     * Hostname or IP hosting the MQTT broker. If the parameter is set to auto the Sender should establish for itself which broker it should use, based on a discovery mechanism or its own internal configuration. A null value indicates that the Sender has not yet been configured.
     */
    destination_host? : string | null,
    
    /**
     * Destination port for MQTT traffic. If the parameter is set to auto the Sender should establish for itself which broker it should use, based on a discovery mechanism or its own internal configuration.
     */
    destination_port? : number | string,
    
    /**
     * Indication of whether TLS is used for communication with the broker. 'mqtt' indicates operation without TLS, and 'secure-mqtt' indicates use of TLS. If the parameter is set to auto the Sender should establish for itself which protocol it should use, based on a discovery mechanism or its own internal configuration.
     */
    broker_protocol? : string,
    
    /**
     * Indication of whether authorization is used for communication with the broker. If the parameter is set to auto the Sender should establish for itself whether authorization should be used, based on a discovery mechanism or its own internal configuration.
     */
    broker_authorization? : string | boolean,
    
    /**
     * The topic which MQTT messages will be sent to on the MQTT broker. A null value indicates that the Sender has not yet been configured.
     */
    broker_topic? : string | null,
    
    /**
     * The topic which MQTT status messages such as MQTT Last Will are sent to on the MQTT broker. A null value indicates that the Sender has not yet been configured, or is not using a connection status topic.
     */
    connection_status_broker_topic? : string | null
};