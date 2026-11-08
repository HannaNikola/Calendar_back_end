import Event from "../models/eventModel.js";
import Todo from "../models/todoModel.js";

async function listEvents(ownerId) {
  const data = await Event.find({ owner: ownerId }).populate("todoIds");

  return data;
}

async function getEventById({ idEvent, owner }) {
  const eventId = await Event.findOne({ _id: idEvent, owner }).populate(
    "todoIds",
  );

  return eventId;
}

async function addEvent({
  title,
  description,
  start,
  end,
  allDay,
  addTask,
  isCompletedTask,
  isImportant,
  todoIds,
  colorEvent,
  repeat,
  reminder,
  owner,
}) {
  const now = new Date();
  const eventStart = start || now;
  const eventEnd =
    end ||
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const data = await Event.create({
    title,
    description,
    start: eventStart,
    end: eventEnd,
    allDay,
    addTask,
    isCompletedTask,
    isImportant,
    todoIds: todoIds || null,
    colorEvent,
    repeat,
    reminder,
    owner,
  });

  return data;
}

// async function updateEventById({ id, owner, body }) {
//   const event = await Event.findOne({ _id: id, owner });
//   if (!event) throw new Error("Event not found");

//   const allowed = [
//     "title",
//     "description",
//     "start",
//     "end",
//     "allDay",
//     "addTask",
//     "isCompletedTask",
//     "isImportant",
//     "colorEvent",
//     "repeat",
//     "reminder",
//   ];

//   for (const key of allowed) {
//     if (body[key] !== undefined) {
//       event[key] = body[key];
//     }
//   }

//   await event.save();

//   if (event.todoIds) {
//     const todoUpdate = {};

//     if (body.title !== undefined) todoUpdate.title = body.title;
//     if (body.start !== undefined) todoUpdate.start = body.start;
//     if (body.end !== undefined) todoUpdate.end = body.end;
//     if (body.description !== undefined)
//       todoUpdate.description = body.description;
//     if (body.isCompletedTask !== undefined)
//       todoUpdate.isCompletedTask = body.isCompletedTask;
//     if (body.isImportant !== undefined)
//       todoUpdate.isImportant = body.isImportant;

//     if (Object.keys(todoUpdate).length > 0) {
//       await Todo.findByIdAndUpdate(event.todoIds, todoUpdate, { new: true });
//     }
//   }

//   return Event.findOne({ _id: id, owner }).populate("todoIds");
// }


async function updateEventById({ id, owner, body }) {
  const event = await Event.findOne({ _id: id, owner });

  if (!event) {
    throw new Error("Event not found");
  }

  const allowed = [
    "title",
    "description",
    "start",
    "end",
    "allDay",
    "addTask",
    "isCompletedTask",
    "isImportant",
    "colorEvent",
    "repeat",
    "reminder",
  ];

  // Обновляем поля Event
  for (const key of allowed) {
    if (body[key] !== undefined) {
      event[key] = body[key];
    }
  }

  // При завершении очищаем описание только у Event
  if (body.isCompletedTask === true) {
    event.description = "";
    event.addTask = false;
  }

  await event.save();

  // Синхронизируем связанные поля Todo
  if (event.todoIds) {
    const todoUpdate = {};

    if (body.title !== undefined) {
      todoUpdate.title = body.title;
    }

    if (body.start !== undefined) {
      todoUpdate.start = body.start;
    }

    if (body.end !== undefined) {
      todoUpdate.end = body.end;
    }

    if (body.allDay !== undefined) {
      todoUpdate.allDay = body.allDay;
    }

    // Описание Todo сохраняем
    if (body.description !== undefined) {
      todoUpdate.description = body.description;
    }

    if (body.isCompletedTask !== undefined) {
      todoUpdate.isCompletedTask = body.isCompletedTask;
    }

    if (body.isImportant !== undefined) {
      todoUpdate.isImportant = body.isImportant;
    }

    if (body.addTask !== undefined) {
      todoUpdate.addTask = body.addTask;
    }

    // Завершённая задача больше не прикреплена к Event
    if (body.isCompletedTask === true) {
      todoUpdate.addTask = false;
    }

    if (Object.keys(todoUpdate).length > 0) {
      await Todo.findOneAndUpdate(
        { _id: event.todoIds, owner },
        { $set: todoUpdate },
        { new: true },
      );
    }
  }

  // Возвращаем обновлённый Event вместе со связанным Todo
  return Event.findOne({ _id: id, owner }).populate("todoIds");
}

async function removeEvent({ id, owner }) {
  const data = await Event.findOneAndDelete({ _id: id, owner });
  // if (data?.todoIds) {
  //   await Todo.findByIdAndDelete(data.todoIds);
  // }
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
