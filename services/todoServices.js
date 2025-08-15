import Todo from "../models/todoModel.js";
import Event from '../models/eventModel.js'; 

async function listTodo() {
  const data = await Todo.find();
  return data;
}
listTodo();




// async function getTodoById(id) {
//   const allIdTodo = await listTodo();
//   const todoId = await Todo.findById(id);

//   return todoId;
// }

async function getTodoById(_id) {
  return await Todo.findById(_id); 
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

const todoServices = {
  listTodo,
  getTodoById,
  addTodo
};
export default todoServices;






