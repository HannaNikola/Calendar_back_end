import Joi from 'joi'


export const createEventSchema = Joi.object({
    title: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    allDay: Joi.boolean(),
    addTask: Joi.boolean()
})


