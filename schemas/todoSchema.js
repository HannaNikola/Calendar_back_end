import Joi from "joi";

export const createTodoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  isImportant: Joi.boolean().optional(),
  isCompleted: Joi.boolean().optional(),
  end: Joi.date().required(),
  allDay: Joi.boolean().optional(),
  eventId: Joi.string().hex().length(24).optional(),
  repeat: Joi.string()
    .valid("none", "daily", "weekday", "weekend")
    .default("none"),
  reminder: Joi.object({
    triggerBefore: Joi.string()
      .valid("30min", "1hour", "1day", "none")
      .default("none"),
    notifyAt: Joi.date().optional(),
    notified: Joi.boolean().default(false),
  }).default({}),
});
