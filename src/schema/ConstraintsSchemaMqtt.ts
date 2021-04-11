import { Constraint } from "./Constraint";
/**
 * Used to express the dynamic constraints on MQTT transport parameters. These constraints may be set and changed at run time. Every transport parameter must have an entry, even if it is only an empty object.
 */
export type ConstraintsSchemaMqtt = {
    destination_host? : Constraint,
    source_host? : Constraint,
    broker_topic? : Constraint,
    broker_protocol? : Constraint,
    broker_authorization? : Constraint,
    connection_status_broker_topic? : Constraint,
    source_port? : Constraint,
    destination_port? : Constraint
};