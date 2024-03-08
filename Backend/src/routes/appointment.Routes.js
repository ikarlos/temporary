import { Router } from "express";
import { upload } from "../middlewares/multer.midleware.js";
import { appointmentDetails, updateAppointmentStatus } from "../controllers/appointment.controller.js";

const router = Router()

router.route("/appointmentDetail").post(upload.none(),appointmentDetails)

router.route("/appointmentstatus").post(upload.none(), updateAppointmentStatus)


export default router

