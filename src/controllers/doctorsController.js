import {
  createDoctorService,
  getDoctorByIdService,
  getDoctorsService,
} from "../services/doctorsService.js";

export const getDoctorsController = async (req, res, next) => {
  try {
    const { search, ids } = req.validated.query;

    const filters = {
      search,
      ids,
    };

    const doctors = await getDoctorsService(filters);

    res.status(200).json({
      message: "Items obtenidos correctamente",
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorByIdController = async (req, res, next) => {
  try {
    const { id } = req.validated.params;

    const doctor = await getDoctorByIdService(id);

    res.status(200).json({
      message: "Item obtenido correctamente",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const createDoctorController = async (req, res, next) => {
  try {
    const doctor = await createDoctorService(req.validated.body);

    res.status(201).json({
      message: "Doctor creado correctamente",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};
