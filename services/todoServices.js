import Todo from "../models/todoModel.js";
import Event from "../models/eventModel.js";

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
  isCompletedTask,
  start,
  end,
  allDay,
  addTask,
  eventId,
}) {
  let event;

  if (!eventId) {
    const now = new Date();

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,59,59,999
    )
    const endTime = end || endOfDay;

    event = await Event.create({
      title,
      start: start || now,
      end: endTime,
      description,
      isImportant,
      addTask,
    });
  } else {
    event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
  }

  const todo = await Todo.create({
    title,
    description,
    isImportant,
    isCompletedTask,
    start: start || event.start,
    end: end || event.end,
    allDay,
    addTask,
    eventId: event._id,
  });

  await Event.findByIdAndUpdate(event._id, { todoId: todo._id });

  return todo;
}



async function updateTodoById(id, body) {
  const data = await Todo.findByIdAndUpdate({ _id: id }, body, { new: true });

  if (!data) throw new Error("Todo not found");
  if (data.eventId) {
    const eventUpdate = {};

    if (body.title !== undefined) eventUpdate.title = body.title;
    if (body.start !== undefined) eventUpdate.start = body.start;
    if (body.end !== undefined) eventUpdate.end = body.end;
    if (body.description !== undefined)
      eventUpdate.description = body.description;
    if (body.isCompletedTask !== undefined)
      eventUpdate.isCompletedTask = body.isCompletedTask;
     if (body.isImportant !== undefined)
      eventUpdate.isImportant = body.isImportant;
    if(body.addTask !== undefined) eventUpdate.addTask = body.addTask;
    if (Object.keys(eventUpdate).length > 0) {
      await Event.findByIdAndUpdate(data.eventId, eventUpdate, { new: true });
    }
  }
  return data;
}

async function removeTodo(id) {
  const data = await Todo.findByIdAndDelete(id);
  if (data?.eventId) {
    await Event.findByIdAndUpdate(data.eventId, {
      todoId: null,
      description: "",
      isCompletedTask: false,
      addTask: false,
    });
  }

  return data;
}

const todoServices = {
  listTodo,
  getTodoById,
  addTodo,
  updateTodoById,
  removeTodo,
};
export default todoServices;








// async function listTodo(ownerId) {
//   const data = await Todo.find({owner: ownerId}).sort({ end: 1 }).populate("eventId");
//   return data;
// }

// async function getTodoById({id, owner}) {
//   const todoId = await Todo.findOne({_id: id, owner }).populate("eventId");
//   return todoId;
// }

// async function addTodo({
//   title,
//   description,
//   isImportant,
//   isCompletedTask,
//   start,
//   end,
//   allDay,
//   addTask,
//   eventId,
//   owner
// }) {
//   let event;

//   if (!eventId) {
//     const now = new Date();

//     const endOfDay = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate(),
//       23,59,59,999
//     )
//     const endTime = end || endOfDay;

//     event = await Event.create({
//       title,
//       start: start || now,
//       end: endTime,
//       description,
//       isImportant,
//       addTask,
//       owner
//     });
//   } else {
//     event = await Event.findOne({ _id: eventId, owner });
//     if (!event) throw new Error("Event not found");
//   }

//   const todo = await Todo.create({
//     title,
//     description,
//     isImportant,
//     isCompletedTask,
//     start: start || event.start,
//     end: end || event.end,
//     allDay,
//     addTask,
//     eventId: event._id,
//     owner
//   });

//   await Event.findByIdAndUpdate(event._id, { todoId: todo._id });

//   return todo;
// }



// async function updateTodoById({id, owner, body}) {
//   const data = await Todo.findOneAndUpdate({ _id: id, owner  }, body , { new: true });

//   if (!data) throw new Error("Todo not found");
//   if (data.eventId) {
//     const eventUpdate = {};

//     if (body.title !== undefined) eventUpdate.title = body.title;
//     if (body.start !== undefined) eventUpdate.start = body.start;
//     if (body.end !== undefined) eventUpdate.end = body.end;
//     if (body.description !== undefined)
//       eventUpdate.description = body.description;
//     if (body.isCompletedTask !== undefined)
//       eventUpdate.isCompletedTask = body.isCompletedTask;
//      if (body.isImportant !== undefined)
//       eventUpdate.isImportant = body.isImportant;
//     if(body.addTask !== undefined) eventUpdate.addTask = body.addTask;
//     if (Object.keys(eventUpdate).length > 0) {
//       // await Event.findByIdAndUpdate(data.eventId, eventUpdate, { new: true });
//       await Event.findOneAndUpdate({ _id: data.eventId, owner }, eventUpdate, { new: true });

//     }
//   }
//   return data;
// }

// async function removeTodo({id, owner}) {
//   const data = await Todo.findOneAndDelete({_id:id, owner});
//   if (data?.eventId) {
//     await Event.findByIdAndUpdate(data.eventId, {
//       todoId: null,
//       description: "",
//       isCompletedTask: false,
//       addTask: false,
//     });
//   }

//   return data;
// }

// const todoServices = {
//   listTodo,
//   getTodoById,
//   addTodo,
//   updateTodoById,
//   removeTodo,
// };
// export default todoServices;








