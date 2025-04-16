import Joi from 'joi'


export const createEventSchema = Joi.object({
    title: Joi.string().required(),
    start: Joi.string().required(),
    end: Joi.string().required(),
    allDay: Joi.boolean(),
    addTask: Joi.boolean()
})