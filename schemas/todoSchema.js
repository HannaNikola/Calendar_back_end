import { Joi, Segments } from "celebrate";

export const createTodoSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(1).required(),
    description: Joi.string().allow(""),
    isImportant: Joi.boolean().optional(),
    isCompletedTask: Joi.boolean().optional(),
    start: Joi.date().optional().allow(null),
    end: Joi.date().optional().allow(null),
    eventId: Joi.string().hex().length(24).optional().allow(null),
  }),
};

export const updateTodoSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(1),
    description: Joi.string().allow(""),
    isImportant: Joi.boolean(),
    isCompletedTask: Joi.boolean(),
    start: Joi.date().optional().allow(null),
    end: Joi.date().optional().allow(null),
    eventId: Joi.string().hex().length(24).optional().allow(null).min(1),
  }),
};
