import Event from "../models/eventModel.js";

async function listEvents() {
  const data = await Event.find();
  console.log(data);
  return data;
}

listEvents();

async function  getEventById(idEvent){

    const allEvent = await listEvents()
    const eventId = await Event.findById(idEvent)
    console.log(eventId)
    return eventId
    }

    


async function addEvent({ title, start, end, allday, addTask }) {
  const data = await Event.create({ title, start, end, allday, addTask });
  console.log(data)
  return data;
}

async function removeEvent(id){
    const data = await Event.findByIdAndDelete(id)
    return data
}




const eventServices = {
  listEvents,
  addEvent,
  getEventById,
  removeEvent
};

export default eventServices;
