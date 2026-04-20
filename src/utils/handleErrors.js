export const handleErrors = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error("--- ERROR INESPERADO: ---", err);

  return res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
};
