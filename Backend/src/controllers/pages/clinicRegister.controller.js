import { checkIfUserLoggedIn } from "../../middlewares/checkForLogin.middleware.js";
import { ClinicDetails, Doctor } from "../../models/doctorDetails.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const clinicRegister=asyncHandler(async (req,res)=>{
    const {loggedUser} =req
    const userId = loggedUser._id;
    const doctorDetail = await Doctor.findOne({ userId });
    res.render("clinic-register",{loggedUser,doctorDetail})
})

export const clinicFormRegister = asyncHandler(async (req, res) => {
    const {loggedUser}=req
    const userId = loggedUser._id;
    const doctorDetail = await Doctor.findOne({ userId });
    const body = req.body;
    console.log(req.body);
    
    try {
        const updatedDoctor = await Doctor.findOneAndUpdate(
            { _id: doctorDetail },
            { $push: {clinicDetails :body} },
            { new: true } // This ensures that the updated document is returned
        );

        if (!updatedDoctor) {
            console.log("Doctor not found");
        }

        console.log(updatedDoctor.consultationDays);
        
        return res.status(200).json({ message: 'Clinic details added successfully' });
    } catch (error) {
        // Handle any potential errors
        console.error(error);
    }
})
