
/**
 * Describes a response to a bulk activation request
 */
export type BulkResponseSchema = Array<{
    
    /**
     * ID of a device to be activated
     */
    id : string,
    
    /**
     * HTTP status code that would have resulted from an individual activation on this device
     */
    code : number,
    
    /**
     * Human readable message which is suitable for user interface display, and helpful to the user. Only included if 'code' indicates an error state
     */
    error? : string,
    
    /**
     * Debug information which may assist a programmer working with the API. Only included if 'code' indicates an error state
     */
    debug? : null | string
}>;