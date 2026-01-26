import { ZodSchema } from "zod/v3";

/**
 * Parses schemas against relevant objects
 * @param {{[key: string]: ZodSchema}} 
 * @returns 
 */
const useValidate = ({
    bodySchema,
    paramSchema,
    querySchema,
    headerSchema
} = {}) => (req, res, next) => {
    try {
        // Short-circuiting:
        // true && console.log("This is true!");
        // false && console.log("This is false!");

        bodySchema && bodySchema.parse(req.body);
        paramSchema && paramSchema.parse(req.params);
        querySchema && querySchema.parse(req.query);
        headerSchema && headerSchema.parse(req.header);

        console.log("[useValidate] Schema validation passed!");
        
        next();
    } catch (err) {
        console.error("UseValidateMiddlewareError:", err);
        res.sendStatus(400);
    }
}

export { useValidate };