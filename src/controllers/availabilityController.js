import {
  createAvailabilityService,
  getAvailabilityService,
  getAvailableDoctorsService,
} from "../services/availabilityService.js";

export const createAvailabilityController = async (req, res, next) => {
  try {
    const availability = await createAvailabilityService(req.validated.body);

    res.status(201).json({
      message: "Disponibilidad creada",
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableDoctorsController = async (req, res, next) => {
  try {
    const { date, start_time, end_time } = req.query;
    const doctors = await getAvailableDoctorsService(
      date,
      start_time,
      end_time,
    );
    res.json({ data: doctors });
  } catch (error) {
    next(error);
  }
};

export const getAvailabilityController = async (req, res, next) => {
  try {
    const data = await getAvailabilityService(req.validated.params.doctorId);

    res.status(200).json({
      message: "Disponibilidad obtenida",
      data,
    });
  } catch (error) {
    next(error);
  }
};
