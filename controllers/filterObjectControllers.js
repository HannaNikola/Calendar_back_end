import filterObjectServices from "../services/filterObjectServices.js";

export const getOverdueTodos = async (req, res, next) => {
  try {
    const data = await filterObjectServices.findOverdueTodos();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

