import { Router } from "express";
import { upload } from "../middlewares/multer.midleware.js";
import { addClinic, addReview, doctorDetails, updateClinicDetails, viewAllDoctors } from "../controllers/doctor.controller.js";

const router = Router();
// to veiw all doctor details
router.route("/doctor").get(viewAllDoctors)
// to post doctor details
router.route("/doctor").post(upload.fields([
    {
      name: "medicalLicense",
      maxCount: 1,
    }, {
        name: "medicalRegistration",
        maxCount: 1,
    },
    {
        name: "idProff",
        maxCount: 1,
    },
    {
        name: "medicalRegistration",
        maxCount: 1,
    }
  ]),doctorDetails)

// doctor review
router.route("/doctor-review/:doctorId").post(upload.none(),addReview)
router.route("/addClinic/:doctorId").put(upload.none(), addClinic)
router.route("/updateClinic/:doctorId").put(upload.none(),updateClinicDetails)


  export default router