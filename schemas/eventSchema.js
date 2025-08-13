import Joi from 'joi'


export const createEventSchema = Joi.object({
  title: Joi.string().required(),
  start: Joi.date().optional().allow(null),
  end: Joi.date().optional().allow(null),
  allDay: Joi.boolean().optional(),
  addTask: Joi.boolean().optional(),
  repeat: Joi.string().valid('none', 'daily', 'weekday', 'weekend')
    .default('none')
});

