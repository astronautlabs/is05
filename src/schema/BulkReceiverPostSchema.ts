import { ReceiverStageSchema } from "./ReceiverStageSchema";
/**
 * Describes a bulk receiver update resource
 */
export type BulkReceiverPostSchema = Array<{
    
    /**
     * ID of the target receiver to apply parameters to
     */
    id : string,
    params : ReceiverStageSchema
}>;