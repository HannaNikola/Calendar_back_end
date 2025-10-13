import httpError from "../helpers/httpError.js";
import eventServices from "../services/eventServices.js";
import todoServices from "../services/todoServices.js";

// export const getAllTodo = async (req, res, next) => {
//   try {
//     const data = await todoServices.listTodo();
//     res.status(200).send(data);
//   } catch (error) {
//     next(error);
//   }
// };


// export const getOneTodo = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const data = await todoServices.getTodoById(id);

//     if (!data) {
//       throw httpError(404, "Todo not found");
//     }

//     res.status(200).send(data);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createTodo = async(req,res,next)=>{
//     try{
//         const data = await todoServices.addTodo(req.body);
//         res.status(201).send(data)
//     }catch(error){
//         next(error)
//     }
// }



// export const updateTodo = async(req, res, next)=>{
//     try{
//         const {id} = req.params;
//         const data = await todoServices.updateTodoById(id, req.body)
//         if(!data){
//             throw httpError(404)
//     }
//     res.status(200).send(data)
// } catch(error){
//     next(error)
// }
// }

// export const deleteTodo = async(req, res, next)=>{
//     try{
//         const {id} = req.params;
//         const data = await todoServices.removeTodo(id);

//         if(!data){
//             throw httpError(404, "todo not found")
//         }
//         res.status(200).json({
//             message:"success",
//             data: data,
//         })
//     }
//     catch(error){
//         next(error)
//     }
// }


//  тестовый вариант ++++++++++++++++++++++++++

export const getAllTodo = async (req, res, next) => {
  try {
    const data = await todoServices.listTodo();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};


export const getOneTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await todoServices.getTodoById(id);

    if (!data) {
      throw httpError(404, "Todo not found");
    }

    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async(req,res,next)=>{
    try{
        const data = await todoServices.addTodo(req.body);
        res.status(201).send(data)
    }catch(error){
        next(error)
    }
}



export const updateTodo = async(req, res, next)=>{
    try{
        const {id} = req.params;
        const data = await todoServices.updateTodoById(id, req.body)
        if(!data){
            throw httpError(404, "Todo not found")
    }
    res.status(200).send(data)
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


