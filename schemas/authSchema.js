import { Joi, Segments } from "celebrate";

export const registerShema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  }),
};

export const loginShema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
  }),
};
