import express from 'express'
import {createEvent, deleteEvent, getAllEvents, getOneEvent, updateEvent} from '../controllers/eventControllers.js'
import validateEventBody from '../helpers/validateEventBody.js'
import { createEventSchema } from '../schemas/eventSchema.js'




const eventRouter = express.Router()

eventRouter.get('/', getAllEvents)
eventRouter.get('/:id', getOneEvent)
eventRouter.delete('/:id',deleteEvent)
eventRouter.post('/',validateEventBody(createEventSchema),createEvent)
eventRouter.put('/:id', validateEventBody(createEventSchema),updateEvent)



export default eventRouter