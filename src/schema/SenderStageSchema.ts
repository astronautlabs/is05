import { ActivationSchema } from "./ActivationSchema";
import { SenderTransportParams } from "./SenderTransportParams";
/**
 * Describes a sender
 */
export type SenderStageSchema = {
    
    /**
     * ID of the target Receiver of this Sender. This will be null if the sender is operating in multicast mode, or has not been assigned a receiver in unicast mode, or is sending to a non-NMOS receiver in unicast mode.
     */
    receiver_id? : string | null,
    
    /**
     * Master on/off control for sender
     */
    master_enable? : boolean,
    activation? : ActivationSchema,
    transport_params? : SenderTransportParams
};