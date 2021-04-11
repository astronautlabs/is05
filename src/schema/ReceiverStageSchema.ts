import { ActivationSchema } from "./ActivationSchema";
import { ReceiverTransportFile } from "./ReceiverTransportFile";
import { ReceiverTransportParams } from "./ReceiverTransportParams";
/**
 * Describes a receiver
 */
export type ReceiverStageSchema = {
    
    /**
     * ID of the Sender subscribed to by this Receiver. This will be null if the receiver has not been configured to receive anything, or if it is receiving from a non-NMOS sender.
     */
    sender_id? : string | null,
    
    /**
     * Master on/off control for receiver
     */
    master_enable? : boolean,
    activation? : ActivationSchema,
    transport_file? : ReceiverTransportFile,
    transport_params? : ReceiverTransportParams
};