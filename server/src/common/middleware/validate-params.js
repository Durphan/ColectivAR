export function validateRequiredParams(paramNames) {
  return (req, res, next) => {
    for (const name of paramNames) {
      const value = req.body[name] ?? req.params[name] ?? req.query[name];
      if (value === undefined || value === null || value === "") {
        return res
          .status(400)
          .json({ error: `Missing required parameter: ${name}` });
      }
    }
    next();
  };
}
