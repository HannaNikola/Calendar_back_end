
import httpError from "./httpError.js";

const validateTodotBody = (schema) =>{
    const func = (req, __, next)=>{
        const {error} = schema.validate(req.body);
        if(error){
            next(httpError(400, error.message));
        }
        next()
    };
    return func
}

export default validateTodotBody