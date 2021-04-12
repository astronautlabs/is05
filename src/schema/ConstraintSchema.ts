
/**
 * Definition of a single constraint record
 */
export type Constraint = {
    
    /**
     * The inclusive maximum value the parameter can be set to
     */
    maximum? : number | number,
    
    /**
     * The inclusive minimum value the parameter can be set to
     */
    minimum? : number | number,
    
    /**
     * An array of allowed values
     */
    enum? : Array<boolean | number | null | number | string>,
    
    /**
     * A regex pattern that must be satisfied for this parameter
     */
    pattern? : string,
    
    /**
     * A human readable string describing the constraint (optional)
     */
    description? : string
}