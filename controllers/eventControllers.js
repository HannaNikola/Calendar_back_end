import httpError from "../helpers/httpError.js";
import eventServices from "../services/eventServices.js";

// export const getAllEvents = async (req, res) => {
//   try {
//     const data = await eventServices.listEvents();
//     // res.send(data).status(200)
//     res.send(data).status(200);
//   } catch (error) {
//     res.status;
//   }
// };

// export const getOneEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = await eventServices.getEventById(id);
//     if (!data) {
//       throw httpError(404);
//     }
//     res.send(data).status(200);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createEvent = async (req, res, next) => {
//   try {
//     const data = await eventServices.addEvent(req.body);
//     res.send(data).status(201);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteEvent = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const data = await eventServices.removeEvent(id);

//     if (!data) {
//       throw httpError(404, "Event not found");
//     }
//     res.status(200).json({
//       message: "Success",
//       data: data,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateEvent = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const data = await eventServices.updateEventById(id, req.body);
//     if (!data) {
//       throw httpError(404);
//     }
//     res.send(data).status(200);
//   } catch (error) {
//     next(error);
//   }
// };

//  тестовый вариант ++++++++++++++++++++++++++

export const getAllEvents = async (req, res,next) => {
  try {
    const data = await eventServices.listEvents();
    res.status(200).send(data);
  } catch (error) {
    next(error)
  }
};

export const getOneEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await eventServices.getEventById(id);
    if (!data) {
      throw httpError(404);
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const data = await eventServices.addEvent(req.body);
     res.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await eventServices.removeEvent(id);

    if (!data) {
      throw httpError(404, "Event not found");
    }
    res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await eventServices.updateEventById(id, req.body);
    if (!data) {
      throw httpError(404);
    }
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

