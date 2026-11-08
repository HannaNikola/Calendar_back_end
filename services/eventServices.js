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
  start,
  end,
  allDay,
  addTask,
  isCompletedTask,
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
    start: eventStart,
    end: eventEnd,
    allDay,
    addTask,
    isCompletedTask,
    colorEvent,
    repeat,
    reminder,
    owner,
  });

  return data;
}

async function updateEventById({ id, owner, body }) {
  const event = await Event.findOne({ _id: id, owner });

  if (!event) {
    throw new Error("Event not found");
  }

  const { todoUpdates = [] } = body;

  const allowed = [
    "title",
    "start",
    "end",
    "allDay",
    "addTask",
    "isCompletedTask",
    "colorEvent",
    "repeat",
    "reminder",
  ];

  for (const key of allowed) {
    if (body[key] !== undefined) {
      event[key] = body[key];
    }
  }

  await event.save();

  for (const todo of todoUpdates) {
    const { id: todoId, ...todoData } = todo;

    if (
      !todoId ||
      !event.todoIds.some((id) => id.toString() === todoId.toString())
    ) {
      throw new Error("Todo does not belong to this Event");
    }

    const allowedTodoFields = [
      "title",
      "description",
      "start",
      "end",
      "isCompletedTask",
      "isImportant",
    ];

    const todoUpdate = {};

    for (const key of allowedTodoFields) {
      if (todoData[key] !== undefined) {
        todoUpdate[key] = todoData[key];
      }
    }

    if (Object.keys(todoUpdate).length === 0) continue;

    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: todoId,
        eventId: event._id,
        owner,
      },
      { $set: todoUpdate },
      { new: true, runValidators: true },
    );

    if (!updatedTodo) {
      throw new Error(
        `Todo ${todoId} not found or does not belong to this Event`,
      );
    }
  }

  return Event.findOne({ _id: id, owner }).populate("todoIds");
}

async function removeEvent({ id, owner }) {
  const data = await Event.findOneAndDelete({ _id: id, owner });

  if (!data) {
    return null;
  }

  await Todo.updateMany(
    { eventId: data._id, owner },
    { $set: { eventId: null } },
  );

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
