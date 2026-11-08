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
  const allowed = [
    "title",
    "description",
    "start",
    "end",
    "isCompletedTask",
    "isImportant",
  ];

  const todoUpdate = {};

  for (const key of allowed) {
    if (body[key] !== undefined) {
      todoUpdate[key] = body[key];
    }
  }

  const data = await Todo.findOneAndUpdate(
    { _id: id, owner },
    { $set: todoUpdate },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!data) {
    throw new Error("Todo not found");
  }

  return data;
}

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
