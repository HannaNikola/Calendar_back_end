import express from 'express'
import {getAllEvents} from '../controllers/eventControllers.js'



const eventRouter = express.Router()

eventRouter.get('/', getAllEvents)

export default eventRouter