import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getOneEvent,
  updateEvent,
} from "../controllers/eventControllers.js";
import { celebrate } from "celebrate";
import { createEventSchema } from "../schemas/eventSchema.js";
import tokenAuth from "../helpers/tokenAuth.js";

const eventRouter = express.Router();

eventRouter.get("/", tokenAuth, getAllEvents);
eventRouter.get("/:id", tokenAuth, getOneEvent);
eventRouter.delete("/:id", tokenAuth, deleteEvent);
eventRouter.post("/", tokenAuth, celebrate(createEventSchema), createEvent);
eventRouter.patch(
  "/:id",
  tokenAuth,
  celebrate(createEventSchema),
  updateEvent
);

export default eventRouter;
