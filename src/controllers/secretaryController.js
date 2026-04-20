import { createSecretaryService } from "../services/secretaryService.js";

export const createSecretaryController = async (req, res, next) => {
  try {
    const secretary = await createSecretaryService(req.validated.body);

    res.status(201).json({
      message: "Secretario creado correctamente",
      data: secretary,
    });
  } catch (error) {
    next(error);
  }
};
