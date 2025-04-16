import express from 'express'
import {createEvent, deleteEvent, getAllEvents, getOneEvent} from '../controllers/eventControllers.js'
import validateEventBody from '../helpers/validateEventBody.js'
import { createEventSchema } from '../schemas/eventSchema.js'




const eventRouter = express.Router()

eventRouter.get('/', getAllEvents)
eventRouter.get('/:id', getOneEvent)
eventRouter.delete('/:id',deleteEvent)
eventRouter.post('/',validateEventBody(createEventSchema),createEvent)



export default eventRouter