import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getOneEvent,
  updateEvent,
} from "../controllers/eventControllers.js";
import validatetBody from "../helpers/validateBody.js";
import { createEventSchema } from "../schemas/eventSchema.js";
import accessTokenAuth from "../helpers/accessTokenAuth.js"

const eventRouter = express.Router();


eventRouter.get("/", accessTokenAuth , getAllEvents);
eventRouter.get("/:id", accessTokenAuth , getOneEvent);
eventRouter.delete("/:id", accessTokenAuth ,  deleteEvent);
eventRouter.post("/", accessTokenAuth , validatetBody(createEventSchema), createEvent);
eventRouter.patch("/:id", accessTokenAuth , validatetBody(createEventSchema), updateEvent);


export default eventRouter;
