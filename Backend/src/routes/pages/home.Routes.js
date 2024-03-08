import { Router } from "express";
import { homePage, labtestFile, pricingFile, radiologyFile, } from "../../controllers/pages/home.controller.js";
import { doctorRegister, loginFile, loginUser, middlewareDoctorRegister, middlewareRegister, middlewarelogin, registerDoctorFile, registerFile, userRegister, userRegisterFileStep1, userUpdateStep1, userUpdateStep2, userUpdateStep3 } from "../../controllers/pages/user.controller.js";


import {  appointmentAccept, deleteClinic, doctorDashboard, getAppointments, myClincs, patientHistory, invoiceFile , accountFile , messageFile , reviewFile, scheduleTiming} from "../../controllers/pages/doctorDashboard.controller.js";

import { doctorRegisterStep1, doctorRegisterStep2, doctorRegisterStep3, doctorUpdateDetail } from "../../controllers/pages/doctorRegisterStep1.js";


import { upload } from "../../middlewares/multer.midleware.js";
import { logoutFile } from "../../controllers/pages/logout.controller.js";
import { profileSetting, updateUser } from "../../controllers/pages/updateuser.conroller.js";

import { clinicFormRegister, clinicRegister } from "../../controllers/pages/clinicRegister.controller.js";


import { doctorProfile, seachDoctor, seachDoctorCategory } from "../../controllers/pages/searchDoctor.controller.js";
import { booking, clinicBooking, confirmAppontment, fetchTime } from "../../controllers/pages/booking.controller.js";
import { checkUserLoggedInMiddleware } from "../../middlewares/loggedUserDetail.middleware.js";
import { fetchDoctorDetailMiddleware } from "../../middlewares/doctorDetail.middleware.js";
import { patientDashboard, viewInvoice } from "../../controllers/pages/patientDashboard.js";

import { searchDoctorsPageFile } from "../../controllers/pages/home.controller.js";
import { videoConsultFile , ambulanceFile , oxygenFile , aboutFile , termFile , privacyFile , refundpage, contactFile} from "../../controllers/pages/home.controller.js";
import { videoCallRegistraionFile } from "../../controllers/pages/videoCallRegistration.contorller.js";
import { chatFile } from "../../controllers/pages/chat.controller.js";
import { accounts, ecash , medrecFile , meddecFile } from "../../controllers/pages/accounts.controller.js";

import { invoice, paymentController, paymentValidator, successPage } from "../../controllers/pages/payment.controller.js";

const router = Router();

router.route("/").get(checkUserLoggedInMiddleware,homePage)
router.route("/index").get(checkUserLoggedInMiddleware,homePage)
router.route("/login").get(loginFile)
router.route("/middlewarelogin/:refreshToken").get(middlewarelogin)
router.route("/login").post(loginUser)
router.route("/logout").get(checkUserLoggedInMiddleware,logoutFile)

router.route("/profile-settings").get(checkUserLoggedInMiddleware,profileSetting)
router.route("/profile-settings").post(upload.fields([
  {
    name:"avatar",
    maxCount:1,
  }
]),checkUserLoggedInMiddleware,updateUser)
router.route("/register").get(registerFile)
router.route("/labtest").get(checkUserLoggedInMiddleware,labtestFile)
router.route("/Radiology").get(checkUserLoggedInMiddleware,radiologyFile)

router.route("/register-user").post(userRegister)
router.route("/middlewareRegister/:refreshToken").get(middlewareRegister)

// user register 
router.route("/user-register-step1").get(userRegisterFileStep1)
router.route("/user-register-step1").post(upload.fields([
  {
    name:"avatar",
    maxCount:1,
  }
]),checkUserLoggedInMiddleware,userUpdateStep1)

router.route("/user-register-step2").post(upload.none(),
checkUserLoggedInMiddleware,userUpdateStep2)

router.route("/user-register-step3").post(upload.none(),
checkUserLoggedInMiddleware,userUpdateStep3)
// doctor regetister 
router.route("/doctor-register").get(registerDoctorFile)
router.route("/doctorRegister").post(doctorRegister)
router.route("/middlewareDoctorRegister/:refreshToken").get(middlewareDoctorRegister)

router.route("/myClinics").get(checkUserLoggedInMiddleware,myClincs)
router.route("/myClinic/:clinicId").get(checkUserLoggedInMiddleware, doctorDashboard)
router.route("/myClinic/mypatientHistory/:clinicId").get(checkUserLoggedInMiddleware,fetchDoctorDetailMiddleware,patientHistory)
router.route("/myClinic/delete/:clinicId").get(checkUserLoggedInMiddleware,deleteClinic)
router.route("/myClinic/scheduleTiming/:clinicId").get(checkUserLoggedInMiddleware,scheduleTiming)
router.route("/myClinic/invoiceFile/:clinicId").get(checkUserLoggedInMiddleware,invoiceFile)
router.route("/myClinic/accountFile/:clinicId").get(checkUserLoggedInMiddleware,accountFile)
router.route("/myClinic/messageFile/:clinicId").get(checkUserLoggedInMiddleware,messageFile)
router.route("/myClinic/reviewFile/:clinicId").get(checkUserLoggedInMiddleware,reviewFile)
// router.route("/appointmentsPage").get(appointmentsPage)
router.route("/accounts").get(checkUserLoggedInMiddleware,accounts)
router.route("/Appointments").get(checkUserLoggedInMiddleware,fetchDoctorDetailMiddleware,getAppointments)



router.route("/Appointments/accept/:appointmentId").get(checkUserLoggedInMiddleware,appointmentAccept)

router.route("/doctorRegisterStep1").get(doctorRegisterStep1)

router.route("/doctor-register-step1").post(upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),doctorUpdateDetail)
  router.route("/doctor-register-step2").post(upload.fields([
    {
      name: "medicalRegistration",
      maxCount: 1,
    },{
      name: "medicalLicense",
      maxCount: 1,
    },{
      name: "idProof",
      maxCount: 1,
    },{
      name: "establishmentProof",
      maxCount: 1,
    },
  ]),doctorRegisterStep2)

router.route("/doctor-register-step3").post(upload.none(), doctorRegisterStep3)

// video call registration
router.route("/video-call-registration").get(videoCallRegistraionFile)

// clinic registration

router.route("/clinicRegister").get(checkUserLoggedInMiddleware,clinicRegister)
router.route("/clinicFormRegister").post(checkUserLoggedInMiddleware,clinicFormRegister)

// route fot chat socket
router.route("/chat/:userId").get(checkUserLoggedInMiddleware,chatFile)

router.route("/doctor-profile/:doctorId").get(checkUserLoggedInMiddleware,doctorProfile)

router.route("/searchDoctor").post(checkUserLoggedInMiddleware,seachDoctor)
router.route("/search-category/:doctorFilter").get(checkUserLoggedInMiddleware,seachDoctorCategory)


router.route("/booking/:doctorId").get(checkUserLoggedInMiddleware,booking)
router.route("/booking-clinic/:doctorId/:clinicId").get(checkUserLoggedInMiddleware,clinicBooking)


router.route("/booking-clinic-day").post(fetchTime)
router.route("/appointmen-confirm").post(checkUserLoggedInMiddleware,confirmAppontment)

// patient info
router.route("/patientDashboard").get(patientDashboard)
router.route("/E-cash").get(checkUserLoggedInMiddleware,ecash)
router.route("/medical-records").get(checkUserLoggedInMiddleware,medrecFile)
router.route("/medical-details").get(checkUserLoggedInMiddleware,meddecFile)
router.route("/viewInvoice/:invoiceId").get(checkUserLoggedInMiddleware,viewInvoice)

router.route("/findDoctor").get(checkUserLoggedInMiddleware,searchDoctorsPageFile)
router.route("/videoConsult").get(checkUserLoggedInMiddleware,videoConsultFile)
router.route("/ambulance").get(checkUserLoggedInMiddleware,ambulanceFile)
router.route("/oxygen").get(checkUserLoggedInMiddleware,oxygenFile)
router.route("/pricing").get(checkUserLoggedInMiddleware,pricingFile)


router.route("/about-us").get(checkUserLoggedInMiddleware,aboutFile)
router.route("/term-condition").get(checkUserLoggedInMiddleware,termFile) 
router.route("/refund-policy").get(checkUserLoggedInMiddleware,refundpage) 
router.route("/privacy-policy").get(checkUserLoggedInMiddleware, privacyFile)
router.route("/contact-us").get(checkUserLoggedInMiddleware, contactFile)

router.route("/pay/:amount").post(checkUserLoggedInMiddleware,paymentController)
router.route("/payment/validate/:merchantTransactionId/:appointmentId").get(checkUserLoggedInMiddleware,paymentValidator)
router.route("/scaduleAppointment/:appointmentId").get(checkUserLoggedInMiddleware,invoice)
router.route("/redirect-url").get(successPage)




export default router