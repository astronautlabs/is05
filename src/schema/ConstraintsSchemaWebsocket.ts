import { Constraint } from "./Constraint";
/**
 * Used to express the dynamic constraints on WebSocket transport parameters. These constraints may be set and changed at run time. Every transport parameter must have an entry, even if it is only an empty object.
 */
export type ConstraintsSchemaWebsocket = {
    connection_uri? : Constraint,
    connection_authorization? : Constraint
};