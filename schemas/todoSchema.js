import Joi from "joi";


export const createTodoSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().allow("").optional(),
  isImportant: Joi.boolean().optional(),
  isCompletedTask: Joi.boolean().optional(),
  start: Joi.date().optional().allow(null),
  end: Joi.date().optional().allow(null),
  allDay: Joi.boolean().optional(),
  eventId: Joi.string().hex().length(24).optional(),
});

export const updateTodoSchema = Joi.object({
  title: Joi.string().trim().min(1),
  description: Joi.string().allow(""),
  isImportant: Joi.boolean(),
  isCompleted: Joi.boolean(),
  start:Joi.date(),
  end: Joi.date(),
  allDay: Joi.boolean(),
  eventId: Joi.string().hex().length(24),
});

