import Todo from "../models/todoModel.js";
import Event from "../models/eventModel.js";

async function listTodo(ownerId) {
  const data = await Todo.find({ owner: ownerId })
    .sort({ end: 1 })
    .populate("eventId", "title");
  return data;
}
async function getTodoById({ id, owner }) {
  const todoId = await Todo.findOne({ _id: id, owner }).populate(
    "eventId",
    "title",
  );
  return todoId;
}

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
//   owner,
// }) {
//   let event;

//   if (!eventId) {
//     const now = new Date();

//     const endOfDay = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate(),
//       23,
//       59,
//       59,
//       999,
//     );
//     const endTime = end || endOfDay;

//     event = await Event.create({
//       title,
//       start: start || now,
//       end: endTime,
//       description,
//       isImportant,
//       addTask,
//       owner,
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
//     allDay: allDay ?? event.allDay ?? false,
//     addTask,
//     eventId: event._id,
//     owner,
//   });

//   await Event.findByIdAndUpdate(event._id, { todoId: todo._id });

//   return todo;
// }

// план б

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
  owner,
}) {
  let event = null;

  if (eventId) {
    event = await Event.findOne({
      _id: eventId,
      owner,
    });
  }


  if (!event) {
    throw new Error("Event not found");
  }

  const todoCount = await Todo.countDocuments({
    eventId: event._id,
    owner,
  })

  if(todoCount >= 3){
    throw new Error("An event can have a maximum of 3 tasks")
  }
  const todo = await Todo.create({
    title,
    description,
    isImportant,
    isCompletedTask,
    start: start ?? event?.start,
    end: end ?? event?.end,
    allDay: allDay ?? event?.allDay ?? false,
    addTask,
    eventId: event?._id ?? null,
    owner,
  });
  if (event) {
    await Event.findByIdAndUpdate(
      { _id: event._id, owner },
      { $set: { todoId: todo._id } },
    );
  }

  return Todo.findById(todo._id).populate("eventId", "title");
}

async function updateTodoById({ id, owner, body }) {
  const data = await Todo.findOneAndUpdate({ _id: id, owner }, body, {
    new: true,
  });

  if (!data) throw new Error("Todo not found");

  if (data.eventId) {
    const eventUpdate = {};

    if (body.title !== undefined) eventUpdate.title = body.title;
    if (body.start !== undefined) eventUpdate.start = body.start;
    if (body.end !== undefined) eventUpdate.end = body.end;

    if (body.allDay !== undefined) {
      eventUpdate.allDay = body.allDay;
    }

    if (body.description !== undefined) {
      eventUpdate.description = body.description;
    }

    if (body.isCompletedTask !== undefined) {
      eventUpdate.isCompletedTask = body.isCompletedTask;

      if (body.isCompletedTask === true) {
        eventUpdate.description = "";
        eventUpdate.addTask = false;
      }
    }

    if (body.isImportant !== undefined) {
      eventUpdate.isImportant = body.isImportant;
    }

    if (body.addTask !== undefined) {
      eventUpdate.addTask = body.addTask;
    }

    if (Object.keys(eventUpdate).length > 0) {
      await Event.findOneAndUpdate(
        { _id: data.eventId, owner },
        { $set: eventUpdate },
        { new: true },
      );
    }
  }

  return data;
}

// план б

// async function updateTodoById({ id, owner, body }) {
//   const data = await Todo.findOneAndUpdate(
//     { _id: id, owner },
//     { $set: body },
//     {
//       new: true,
//       runValidators: true,
//     },
//   ).populate("eventId");

//   if (!data) throw new Error("Todo not found");
//   if (data.eventId) {
//     const eventUpdate = {};

//     if (body.title !== undefined) eventUpdate.title = body.title;
//     if (body.description !== undefined) {
//       eventUpdate.description = body.description;
//     }
//     if (body.start !== undefined) eventUpdate.start = body.start;
//     if (body.end !== undefined) eventUpdate.end = body.end;
//     if (body.allDay !== undefined) eventUpdate.allDay = body.allDay;
//     if (body.isCompletedTask !== undefined) {
//       eventUpdate.isCompletedTask = body.isCompletedTask;
//     }
//     if (body.isImportant !== undefined) {
//       eventUpdate.isImportant = body.isImportant;
//     }
//     if (body.addTask !== undefined) {
//       eventUpdate.addTask = body.addTask;
//     }

//     if (Object.keys(eventUpdate).length > 0) {
//       await Event.findOneAndUpdate(
//         { _id: data.eventId, owner },
//         { $set: eventUpdate },
//         { new: true },
//       );
//     }
//   }

//   return data;
// }

// async function removeTodo({ id, owner }) {
//   const data = await Todo.findOneAndDelete({ _id: id, owner });

//   if (!data) {
//     return null;
//   }

//   if (data.eventId) {
//     await Event.findByIdAndUpdate(
//       {
//         _id: data.eventId,
//         owner,
//       },
//       {
//         $set: {
//           todoId: null,
//           addTask: false,
//           description: "",
//           isCompletedTask: false,
//         },
//       },
//     );
//   }
//   return data;
// }

// план б
async function removeTodo({ id, owner }) {
  const data = await Todo.findOneAndDelete({ _id: id, owner });

  if (!data) {
    return null;
  }

  if (data.eventId) {
    await Event.findOneAndUpdate(
      {
        _id: data.eventId,
        owner,
        todoId: data._id,
      },
      {
        $set: {
          todoId: null,
          addTask: false,
          isCompletedTask: false,
          description: "",
        },
      },
    );
  }
  return data;
}

export default {
  listTodo,
  getTodoById,
  addTodo,
  updateTodoById,
  removeTodo,
};
