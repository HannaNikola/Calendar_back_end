import httpError from "./httpError.js";

const validateEventBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(httpError(400, error.message));
    }
    next();
  };
  return func;
};

export default validateEventBody;
