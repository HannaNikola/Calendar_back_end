import express from 'express'
import {createEvent, getAllEvents, getOneEvent} from '../controllers/eventControllers.js'
import validateEventBody from '../helpers/validateEventBody.js'
import { createEventSchema } from '../schemas/eventSchema.js'




const eventRouter = express.Router()

eventRouter.get('/', getAllEvents)
eventRouter.get('/:id', getOneEvent)
eventRouter.post('/',validateEventBody(createEventSchema),createEvent)



export default eventRouter