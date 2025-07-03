import Event from "../models/eventModel.js";

async function listEvents() {
  const data = await Event.find();

  return data;
}

listEvents();

async function getEventById(idEvent) {
  const allEvent = await listEvents();
  const eventId = await Event.findById(idEvent);

  return eventId;
}

async function addEvent({ title, start, end, allDay, addTask }) {
  const data = await Event.create({ title, start, end, allDay, addTask });

  return data;
}

async function removeEvent(id) {
  const data = await Event.findByIdAndDelete(id);
  return data;
}

async function updateEventById(id, body) {
  const data = await Event.findByIdAndUpdate({ _id: id }, body, { new: true });
  return data;
}

const eventServices = {
  listEvents,
  addEvent,
  getEventById,
  removeEvent,
  updateEventById,
};

export default eventServices;
