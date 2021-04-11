import { SenderStageSchema } from "./SenderStageSchema";
/**
 * Describes a bulk sender update resource
 */
export type BulkSenderPostSchema = Array<{
    
    /**
     * ID of the target sender to apply parameters to
     */
    id : string,
    params : SenderStageSchema
}>;