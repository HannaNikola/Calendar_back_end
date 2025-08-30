import Todo from "../models/todoModel.js";
import Event from '../models/eventModel.js'; 

async function listTodo() {
  const data = await Todo.find().sort({ end: 1 });
  return data;
}
listTodo();


async function getTodoById(id) {
  const todoId = await Todo.findById(id);
  return todoId;
}


async function addTodo({
  title,
  description,
  isImportant,
  isCompleted,
  end,
  allDay,
  eventId,
  repeat,
  reminder,
}) {
    if(!eventId){
        throw new Error("Event ID is required")
    };

     const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  };
   if (!end) {
    end = event.end;
  }
  if(!title){
    throw new Error("Event Title not found");
  }

  const data = await Todo.create({title,
  description,
  isImportant,
  isCompleted,
  end,
  allDay,
  eventId,
  repeat,
  reminder,});
  return data;
}

async function updateTodoById(id, body) {
    const data = await Todo.findByIdAndUpdate({_id:id}, body, {new: true})
    return data
}

async function removeTodo(id){
    const data = await Todo.findByIdAndDelete(id);
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






