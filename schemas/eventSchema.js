import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().required(),
  start: Joi.date().optional().allow(null),
  description: Joi.string().allow(""),
  end: Joi.date().optional().allow(null),
  allDay: Joi.boolean().optional(),
  addTask: Joi.boolean().optional(),
  isCompletedTask: Joi.boolean().optional(),
  isImportant: Joi.boolean().optional(),
  todoId: Joi.string().hex().length(24),
  colorEvent: Joi.string(),
  repeat: Joi.string()
    .valid("none", "daily", "workday", "weekend", "yearly")
    .default("none"),
  reminder: Joi.object({
    triggerBefore: Joi.string()
      .valid("30min", "1hour", "1day", "none")
      .default("none"),
    notifyAt: Joi.date().allow(null).optional(),
    notified: Joi.boolean().default(false),
  }).default({}),
});
