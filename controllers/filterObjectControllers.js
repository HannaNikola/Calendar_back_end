import filterObjectServices from "../services/filterObjectServices.js";

export const getOverdueTodos = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const data = await filterObjectServices.findOverdueTodos(userId);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};



