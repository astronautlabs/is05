import { Constraint } from "./ConstraintSchema";
/**
 * Used to express the dynamic constraints on RTP transport parameters. These constraints may be set and changed at run time. Every transport parameter must have an entry, even if it is only an empty object.
 */
export type ConstraintsSchemaRtp = {
    multicast_ip? : Constraint,
    destination_ip? : Constraint,
    destination_port? : Constraint,
    source_ip? : Constraint,
    interface_ip? : Constraint,
    source_port? : Constraint,
    fec_enabled? : Constraint,
    fec_destination_ip? : Constraint,
    fec_mode? : Constraint,
    fec_type? : Constraint,
    fec_block_width? : Constraint,
    fec_block_height? : Constraint,
    fec1D_destination_port? : Constraint,
    fec2D_destination_port? : Constraint,
    fec1D_source_port? : Constraint,
    fec2D_source_port? : Constraint,
    rtcp_enabled? : Constraint,
    rtcp_destination_ip? : Constraint,
    rtcp_destination_port? : Constraint,
    rtcp_source_port? : Constraint,
    rtp_enabled? : Constraint
};