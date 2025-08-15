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

// export const getOneTodo = async (req, res) => {
//   try {
//     const {id} = req.params;
//     // console.log(req.params)
//     const data = await todoServices.getTodoById(id);
//     if (!data) {
//       throw httpError(404);
//     }
//     res.status(200).send(data);
//   } catch (error) {
//     next(error);
//   }
// };


export const getOneTodo = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const data = await todoServices.getTodoById(_id);

    if (!data) {
      throw httpError(404, "Todo not found");
    }

    res.status(200).send(data);
  } catch (error) {
    next(error)
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








