import Todo from "../models/todoModel.js";

async function findOverdueTodos() {
  const data = await Todo.find({
    user: userId, 
    end: { $lt: new Date() },
    isCompleted: false,
  }).sort({ end: 1 });
  return data;
}

const  filterObjectServices = {
  findOverdueTodos
};

export default filterObjectServices;