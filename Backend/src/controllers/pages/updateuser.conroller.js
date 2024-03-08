import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { Doctor } from "../../models/doctorDetails.model.js";


export const profileSetting = asyncHandler(async (req, res) => {
  const { loggedUser } = req
  if (loggedUser.isDoctor) {
    const userId = loggedUser._id
    const doctorDetail = await Doctor.findOne({ userId });

    return res.render("doctor-profile-settings", { loggedUser, doctorDetail })
  } else {
    return res.render("profile-settings", { loggedUser })
  }

})
export const updateUser = asyncHandler(async (req, res) => {
  const { loggedUser } = req;
  const {
    fullName,
    bloodGroup,
    email,
    number,
    address,
    city,
    state,
    pincode,
    country
  } = req.body;
  // console.log(req.body);
  const avatar = req.files?.avatar?.[0]?.path;
  console.log(avatar);
  const updatedUser = await User.findOneAndUpdate(
    { _id: loggedUser._id },
    {
      $set: {
        fullName,
        bloodGroup,
        email,
        avatar,
        number,
        address,
        city,
        state,
        pincode,
        country
      }
    },
    { new: true }
  );
  if(updateUser){

    console.log(updateUser);
  }
  if (loggedUser.isDoctor) {
    const {
      specialty,
      degree,
      college,
      yearsOfCompletion,
      experience,
      registrationNumber,
      registeredCouncil,
      registrationYear
    } = req.body;
    const medicalLicense = req.files?.medicalLicense?.[0]?.path;
    const idProof = req.files?.idProof?.[0]?.path;
    const establishmentProof = req.files?.establishmentProof?.[0]?.path;

    const updateDoctorDetail = await Doctor.findOneAndUpdate(
      { userId: loggedUser._id },
      {
        $set: {
          specialty,
          degree,
          college,
          yearsOfCompletion,
          experience,
          registrationNumber,
          registeredCouncil,
          registrationYear,
          medicalLicense,
          idProof,
          establishmentProof
        }
      },
      { new: true }
    );
   
  }

  return res.redirect("/profile-settings");
});
