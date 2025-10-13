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

const eventRouter = express.Router();

eventRouter.get("/", getAllEvents);
eventRouter.get("/:id", getOneEvent);
eventRouter.delete("/:id", deleteEvent);
eventRouter.post("/", validatetBody(createEventSchema), createEvent);
eventRouter.patch("/:id",validatetBody(createEventSchema), updateEvent);


export default eventRouter;
