import httpError from "../helpers/httpError.js";
import eventServices from "../services/eventServices.js";
import todoServices from "../services/todoServices.js";

export const getAllTodo = async (req, res) => {
  try {
    const data = await todoServices.listTodo();
    res.send(data).status(200);
  } catch (error) {
    res.status;
  }
};


export const getOneTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await todoServices.getTodoById(id);

    if (!data) {
      throw httpError(404, "Todo not found");
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async(req,res,next)=>{
    try{
        const data = await todoServices.addTodo(req.body);
        res.send(data).status(201)
    }catch(error){
        next(error)
    }
}



export const updateTodo = async(req, res, next)=>{
    try{
        const {id} = req.params;
        const data = await todoServices.updateTodoById(id, req.body)
        if(!data){
            throw httpError(404)
    }
    res.send(data).status(200)
} catch(error){
    next(error)
}
}

export const deleteTodo = async(req, res, next)=>{
    try{
        const {id} = req.params;
        const data = await todoServices.removeTodo(id);

        if(!data){
            throw httpError(404, "todo not found")
        }
        res.status(200).json({
            message:"success",
            data: data,
        })
    }
    catch(error){
        next(error)
    }
}


