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

    if (!event) {
      throw new Error("Event not found");
    }

    const todoCount = await Todo.countDocuments({
      eventId: event._id,
      owner,
    });

    if (todoCount >= 3) {
      throw new Error("An event can have a maximum of 3 tasks");
    }
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
    await Event.findOneAndUpdate(
      { _id: event._id, owner },
      {
        $addToSet: {
          todoIds: todo._id,
        },
      },
    );
  }

  const result = await Todo.findById(todo._id).populate("eventId", "title");

  return result;
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

async function removeTodo({ id, owner }) {
  const data = await Todo.findOneAndDelete({ _id: id, owner });

  if (!data) {
    return null;
  }

  if (data.eventId) {
    const remainingTodos = await Todo.countDocuments({
      eventId: data.eventId,
      owner,
    });

    const update = {
      $pull: {
        todoIds: data._id,
      },
    };

    if (remainingTodos === 0) {
      update.$set = {
        addTask: false,
        isCompletedTask: false,
        description: "",
      };
    }

    await Event.findOneAndUpdate(
      {
        _id: data.eventId,
        owner,
      },
      update,
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
