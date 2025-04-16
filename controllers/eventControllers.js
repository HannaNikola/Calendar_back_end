import httpError from "../helpers/httpError.js";
import eventServices from "../services/eventServices.js";

export const getAllEvents = async (req, res) => {
  try {
    const data = await eventServices.listEvents();
    // res.send(data).status(200)
    res.send(data).status(200);
  } catch (error) {
    res.status;
  }
};

export const getOneEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await eventServices.getEventById(id);
    if (!data) {
      throw httpError(404);
    }
    res.send(data).status(200);
  } catch (error) {
    next(error);
  }
};




export const createEvent = async (req, res, next) => {
  try {
    const data = await eventServices.addEvent(req.body);
    res.send(data).status(201);
    console.log(data);
  } catch (error) {
    next(error);
  }
};
