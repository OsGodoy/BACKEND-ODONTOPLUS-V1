export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  req.validated = result.data;

  next();
};
