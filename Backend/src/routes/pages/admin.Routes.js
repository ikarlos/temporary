import { Router } from "express";
import { doctorList, doctorProfile2, rejectProfile, updateDoctorProfile } from "../../controllers/pages/admin/adminDashboard.js";
import { checkUserLoggedInMiddleware } from "../../middlewares/loggedUserDetail.middleware.js";
import { doctorProfile } from "../../controllers/pages/searchDoctor.controller.js";

const router = Router();

router.route("/doctorList").get(checkUserLoggedInMiddleware, doctorList)
router.route("/doctorList/doctorProfile/:doctorId").get(checkUserLoggedInMiddleware, doctorProfile2)
router.route("/doctorList/updateDoctor/:doctorId").post(checkUserLoggedInMiddleware,updateDoctorProfile)
router.route("/reject-profile/:doctorId").post(rejectProfile)



export default router