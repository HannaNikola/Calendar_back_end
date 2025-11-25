import Joi from "joi";

const emailRegexp =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerShema = Joi.object({
  name: Joi.string().max(50).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).max(50).required(),
  
});

export const loginShema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).max(50).required(),
  
});

