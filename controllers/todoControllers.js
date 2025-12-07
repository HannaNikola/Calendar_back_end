import { userAgent } from "next/server.js";
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
//             throw httpError(404, "Todo not found")
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


export const getAllTodo = async (req, res, next) => {
  try {
    const {_id: userId}= req.user
    const data = await todoServices.listTodo(userId);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};


export const getOneTodo = async (req, res, next) => {
  try {
    const {_id: userId}= req.user;
    const { id } = req.params;
    const data = await todoServices.getTodoById({id , owner: userId});

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
      const {_id: userId}= req.user;
        const data = await todoServices.addTodo({...req.body, owner: userId});
        res.status(201).send(data)
    }catch(error){
        next(error)
    }
}



export const updateTodo = async(req, res, next)=>{
    try{
      const {_id: userId} = req.user;
        const {id} = req.params;
        const data = await todoServices.updateTodoById({id, owner: userId, body:req.body})
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
      const{_id:userId}= req.user;
        const {id} = req.params;
        const data = await todoServices.removeTodo({id, owner: userId});

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











// export const getAllEvents = async (req, res, next) => {
//   try {
//     const { _id: userId } = req.user;
//     const data = await eventServices.listEvents(userId);
//     res.status(200).send(data);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getOneEvent = async (req, res, next) => {
//   try {
//     const { _id: userId } = req.user;
//     const { id } = req.params;

//     const data = await eventServices.getEventById({
//       idEvent: id,
//       owner: userId
//     });

//     if (!data) throw httpError(404, "Event not found");

//     res.status(200).send(data);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createEvent = async (req, res, next) => {
//   try {
//     const { _id: userId } = req.user;

//     const data = await eventServices.addEvent({
//       ...req.body,
//       owner: userId
//     });

//     res.status(201).send(data);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteEvent = async (req, res, next) => {
//   try {
//     const { _id: userId } = req.user;
//     const { id } = req.params;

//     const data = await eventServices.removeEvent({ id, owner: userId });

//     if (!data) throw httpError(404, "Event not found");

//     res.status(200).json({
//       message: "Success",
//       data
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateEvent = async (req, res, next) => {
//   try {
//     const { _id: userId } = req.user;
//     const { id } = req.params;

//     const data = await eventServices.updateEventById({
//       id,
//       owner: userId,
//       body: req.body
//     });

//     if (!data) throw httpError(404, "Event not found");

//     res.status(200).send(data);
//   } catch (error) {
//     next(error);
//   }
// };
