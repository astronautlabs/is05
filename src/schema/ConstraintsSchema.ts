import { ConstraintsSchemaRtp } from "./ConstraintsSchemaRtp";
import { ConstraintsSchemaWebsocket } from "./ConstraintsSchemaWebsocket";
import { ConstraintsSchemaMqtt } from "./ConstraintsSchemaMqtt";
/**
 * Used to express the dynamic constraints on transport parameters. These constraints may be set and changed at run time. Parameters must also conform with constraints inferred from the specification. Every transport parameter must have an entry, even if it is only an empty object.
 */
export type ConstraintsSchema = Array<ConstraintsSchemaRtp> | Array<ConstraintsSchemaWebsocket> | Array<ConstraintsSchemaMqtt>;