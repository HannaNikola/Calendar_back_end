import httpError from "../helpers/httpError.js";
import eventServices from "../services/eventServices.js";



export const getAllEvents = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const data = await eventServices.listEvents(userId);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

export const getOneEvent = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { id } = req.params;
    const data = await eventServices.getEventById({
      idEvent: id,
      owner: userId,
    });
    if (!data) {
      throw httpError(404, "Event not found");
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const data = await eventServices.addEvent({ ...req.body, owner: userId });
    res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { id } = req.params;
    const data = await eventServices.removeEvent({ id, owner: userId });

    if (!data) {
      throw httpError(404, "Event not found");
    }
    res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { id } = req.params;
    const data = await eventServices.updateEventById({
      id,
      owner: userId,
      body: req.body,
    });
    if (!data) {
      throw httpError(404, "Event not found");
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};
