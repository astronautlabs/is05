
/**
 * Parameters concerned with activation of the transport parameters
 */
export type ActivationResponseSchema = {
    
    /**
     * Mode of activation: immediate (on message receipt), scheduled_absolute (when internal clock >= requested_time), scheduled_relative (when internal clock >= time of message receipt + requested_time), or null (no activation scheduled). This parameter returns to null on the staged endpoint once an activation is completed or when it is explicitly set to null. For immediate activations, in the response to the PATCH request this field will be set to 'activate_immediate', but will be null in response to any subsequent GET requests.
     */
    mode : string | null,
    
    /**
     * String formatted TAI timestamp (<seconds>:<nanoseconds>) indicating time (absolute or relative) for activation requested. This field returns to null once the activation is completed on the staged endpoint or when the resource is unlocked by setting the activation mode to null. For an immediate activation this field will always be null on the staged endpoint, even in the response to the PATCH request.
     */
    requested_time : string | null,
    
    /**
     * String formatted TAI timestamp (<seconds>:<nanoseconds>) indicating the absolute time the sender or receiver will or did actually activate for scheduled activations, or the time activation occurred for immediate activations. On the staged endpoint this field returns to null once the activation is completed or when the resource is unlocked by setting the activation mode to null. For immediate activations on the staged endpoint this property will be the time the activation actually occurred in the response to the PATCH request, but null in response to any GET requests thereafter.
     */
    activation_time : string | null
};