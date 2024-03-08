import { checkIfUserLoggedIn } from "../../middlewares/checkForLogin.middleware.js";
import { Doctor } from "../../models/doctorDetails.model.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { logoutUser } from "../user.controllers.js";
// login file
export const doctorRegisterStep1 = asyncHandler(async (req, res) => {
  res.render("doctor-register-step1")
})
export const doctorUpdateDetail = asyncHandler(async (req, res) => {
  const {
    gender,
    email,
    address,
    locality,
    city,
    state,
    language,



  } = req.body;

  // Get the filename of the uploaded avatar
  let avatar = req.files?.avatar?.[0]?.path;
  if (!avatar) {
    avatar = "default"
  }
  // console.log(avatar);
  const { refreshToken } = req.cookies;

  const loggedUser = await checkIfUserLoggedIn(refreshToken);
console.log(loggedUser); 

  const user = await User.findOneAndUpdate(
    { _id: loggedUser._id },
    {
      $set: {

        gender,
        email,
        address,
        locality,
        city,
        state,
        language,
        avatar
      }
    },
    {
      new: true
    }
  )
  if (!user) {
    return res.redirect("/")

  }
  console.log(user);
  return res.render("doctor-register-step2");
});
export const doctorRegisterStep2 = asyncHandler(async (req, res) => {
  const {
    RgistrationNumber,
    registeredCouncil,
    registrationYear,




  } = req.body;
  // Get the filename of the uploaded avatar
  const medicalRegistration = req.files?.medicalRegistration?.[0]?.path;

  const medicalLicense = req.files?.medicalLicense?.[0]?.path;

  const idProof = req.files?.idProof?.[0]?.path;

  const establishmentProof = req.files?.establishmentProof?.[0]?.path;

  const { refreshToken } = req.cookies;

  const loggedUser = await checkIfUserLoggedIn(refreshToken);
  const doctor = await Doctor.create(
    {
      userId: loggedUser._id,

      RgistrationNumber,
      registeredCouncil,
      registrationYear,
      medicalRegistration,
      medicalLicense,
      idProof,
      establishmentProof
    }

  )
  console.log(doctor);
  if (!doctor) {
    return res.redirect("/doctorRegisterStep1")
  }
  const doctorId = doctor._id
  console.log(doctorId);
  return res.render("doctor-register-step3", { doctorId })
})

export const doctorRegisterStep3 = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  const {
    degree,
    doctorId,
    specialty,
    college,
    yearsOfCompletion,
    experience
  } = req.body;
  // const degree = req.files?.degree?.[0]?.path;


  const loggedUser = await checkIfUserLoggedIn(refreshToken);
  console.log(loggedUser);
  const doctor = await Doctor.findOneAndUpdate(
    { _id: doctorId },
    {
      $set: {

        specialty: specialty.toLowerCase(),
        college,
        yearsOfCompletion,
        experience,
        degree
      }
    },
    {
      new: true
    }
  )
  console.log(doctor.userId);
  if (!doctor) {
    return res.redirect("/doctorRegisterStep1")
  }
  console.log(doctorId);
  return res.redirect("/clinicRegister")
})