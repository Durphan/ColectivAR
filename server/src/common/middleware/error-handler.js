import logger from "../config/logger.js";

export default (err, req, res, _next) => {
  logger.error(err.message);
  res.status(500).json({ error: err.message });
};
