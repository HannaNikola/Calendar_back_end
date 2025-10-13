import Todo from "../models/todoModel.js";
import Event from '../models/eventModel.js'; 

// async function listTodo() {
//   const data = await Todo.find().sort({ end: 1 }).populate("eventId");
//   return data;
// }



// async function getTodoById(id) {
//   const todoId = await Todo.findById(id).populate("eventId");
//   return todoId;
// }


// async function addTodo({
//   title,
//   description,
//   isImportant,
//   isCompleted,
//   start,
//   end,
//   allDay,
//   eventId,
  
// }) {
//     if(!eventId){
//         throw new Error("Event ID is required")
//     };

//      const event = await Event.findById(eventId);
//   if (!event) {
//     throw new Error("Event not found");
//   };
//   if(!start)  start = event.start || new Date();
  
//    if (!end) end = event.end || start;
  

//   const data = await Todo.create({title,
//   description,
//   isImportant,
//   isCompleted,
//   start,
//   end,
//   allDay,
//   eventId,
//   });
//   return data;
// }

// async function updateTodoById(id, body) {
//     const data = await Todo.findByIdAndUpdate({_id:id}, body, {new: true})

//     if (!data) throw new Error("Todo not found");
//     if(data.eventId){
//       const eventUpdate = {};

//       if (body.title !== undefined) eventUpdate.title = body.title;
//     if (body.start !== undefined) eventUpdate.start = body.start;
//     if (body.end !== undefined) eventUpdate.end = body.end;
//     if (body.description !== undefined) eventUpdate.description = body.description;


//     if (Object.keys(eventUpdate).length > 0) {
//       await Event.findByIdAndUpdate(data.eventId, eventUpdate, { new: true });
//     }
//   }
//     return data
// }

// async function removeTodo(id){
//     const data = await Todo.findByIdAndDelete(id);
//     if(data?.eventId){
//       await Event.findByIdAndUpdate(data.eventId, {todoId: null})
//     }
//     return data;
// }


// const todoServices = {
//   listTodo,
//   getTodoById,
//   addTodo,
//   updateTodoById,
//   removeTodo
// };
// export default todoServices;


//  тестовый вариант ++++++++++++++++++++++++++

async function listTodo() {
  const data = await Todo.find().sort({ end: 1 }).populate("eventId");
  return data;
}



async function getTodoById(id) {
  const todoId = await Todo.findById(id).populate("eventId");
  return todoId;
}


async function addTodo({
  title,
  description,
  isImportant,
  isCompleted,
  start,
  end,
  allDay,
  eventId,
}) {
  let event;

  if (!eventId) {
   
    const now = new Date();
    event = await Event.create({
      title,
      start: start || now,
      end: end || start || now,
      description,
    });
  } else {
    event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
  }

 
  const todo = await Todo.create({
    title,
    description,
    isImportant,
    isCompleted,
    start: start || event.start,
    end: end || event.end,
    allDay,
    eventId: event._id,
  });

  
  await Event.findByIdAndUpdate(event._id, { todoId: todo._id });

  return todo;
}



async function updateTodoById(id, body) {
    const data = await Todo.findByIdAndUpdate({_id:id}, body, {new: true})

    if (!data) throw new Error("Todo not found");
    if(data.eventId){
      const eventUpdate = {};

      if (body.title !== undefined) eventUpdate.title = body.title;
    if (body.start !== undefined) eventUpdate.start = body.start;
    if (body.end !== undefined) eventUpdate.end = body.end;
    if (body.description !== undefined) eventUpdate.description = body.description;


    if (Object.keys(eventUpdate).length > 0) {
      await Event.findByIdAndUpdate(data.eventId, eventUpdate, { new: true });
    }
  }
    return data
}

async function removeTodo(id){
    const data = await Todo.findByIdAndDelete(id);
    if(data?.eventId){
      await Event.findByIdAndUpdate(data.eventId, {todoId: null})
    }
    return data;
}


const todoServices = {
  listTodo,
  getTodoById,
  addTodo,
  updateTodoById,
  removeTodo
};
export default todoServices;








