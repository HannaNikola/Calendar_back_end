import Event from "../models/eventModel.js";
import Todo from "../models/todoModel.js";

// async function listEvents() {
//   const data = await Event.find();

//   return data;
// }

// listEvents();

// async function getEventById(idEvent) {
//   const allEvent = await listEvents();
//   const eventId = await Event.findById(idEvent);

//   return eventId;
// }


// async function addEvent({
//   title,
//   start,
//   end,
//   allDay,
//   addTask,
//   todoId,
//   colorEvent,
//   repeat,
//   reminder,
// }) {
//   const data = await Event.create({
//     title,
//     start,
//     end,
//     allDay,
//     addTask,
//     todoId,
//     colorEvent,
//     repeat,
//     reminder,
//   });

//   return data;
// }

// async function removeEvent(id) {
//   const data = await Event.findByIdAndDelete(id);
//   return data;
// }

// async function updateEventById(id, body) {
//   const data = await Event.findByIdAndUpdate({ _id: id }, body, { new: true });
//   return data;
// }

// const eventServices = {
//   listEvents,
//   addEvent,
//   getEventById,
//   removeEvent,
//   updateEventById,
// };

// export default eventServices;


//  тестовый вариант ++++++++++++++++++++++++++

async function listEvents() {
  const data = await Event.find().populate("todoId");

  return data;
}




async function getEventById(idEvent) {
  const eventId = await Event.findById(idEvent).populate("todoId");

  return eventId;
}


async function addEvent({
  title,
  description,
  start,
  end,
  allDay,
  addTask,
  todoId,
  colorEvent,
  repeat,
  reminder,
}) {
   const now = new Date();
  const eventStart = start || now;
  const eventEnd = end || now;

  const data = await Event.create({
    title,
    description,
    start: eventStart,
    end: eventEnd,
    allDay,
    addTask,
    todoId: todoId || null,
    colorEvent,
    repeat,
    reminder,
  });

  return data
}

// async function updateEventById(id, body) {
//   const data = await Event.findByIdAndUpdate({ _id: id }, body, { new: true }).populate("todoId");
//   return data;
// }

async function updateEventById(id, body) {
  
  const event = await Event.findById(id);
  if (!event) throw new Error("Event not found");

 
  Object.assign(event, body);
  await event.save();

  
  if (event.todoId) {
    const todoUpdate = {};
    if (body.title !== undefined) todoUpdate.title = body.title;
    if (body.start !== undefined) todoUpdate.start = body.start;
    if (body.end !== undefined) todoUpdate.end = body.end;
    if (body.description !== undefined) todoUpdate.description = body.description;

    if (Object.keys(todoUpdate).length > 0) {
      await Todo.findByIdAndUpdate(event.todoId, todoUpdate, { new: true });
    }
  }

  
  return Event.findById(id).populate("todoId");
}




async function removeEvent(id) {
  const data = await Event.findByIdAndDelete(id);
  if(data?.todoId){
    await Todo.findByIdAndDelete(data.todoId)
  }
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
