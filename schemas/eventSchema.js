import Joi from 'joi'


// export const createEventSchema = Joi.object({
//     title: Joi.string().required(),
//     start: Joi.date(),
//     end: Joi.date(),
//     allDay: Joi.boolean(),
//     addTask: Joi.boolean()
// })

export const createEventSchema = Joi.object({
  title: Joi.string().required(),
  start: Joi.date().optional().allow(null),
  end: Joi.date().optional().allow(null),
  allDay: Joi.boolean().optional(),
  addTask: Joi.boolean().optional()
});

