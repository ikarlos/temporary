import { Doctor  } from "../models/doctorDetails.model.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponseError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// registering doctors details
export const doctorDetails = asyncHandler(async (req,res)=>{
    // get user detail form front end
    console.log(req.body);
    const {
        userId,
        medicalLicense,
        specialty,
        medicalRegistration,
        registeredCouncil,
        registrationYear,
        degree,
        college,
        yearOfCompletion,
        experience,
        idProff,
        establishmentProff,
        clinicDetails
    } = req.body
    
    const medicalLicensepath = req.files?.medicalLicense?.[0]?.path;
    const medicalRegistrationpath = req.files?.medicalRegistration?.[0]?.path;
    const idProffpath = req.files?.idProff?.[0]?.path
    // const establishmentProffpath = req.files?.establishmentProff[0].path

    // create user object in db
    const doctor = await Doctor.create({
        userId,
        medicalLicense: medicalLicensepath?medicalLicensepath :" " ,
        specialty,
        medicalRegistration : medicalRegistrationpath?medicalRegistrationpath :" ",
        registeredCouncil,
        registrationYear,
        degree,
        college,
        yearOfCompletion,
        experience,
        idProff : idProffpath?idProffpath :" ",
        clinicDetails
    })
    console.log(doctor._id);
    const createdDoctor = await Doctor.findById(doctor._id);

    // check for user creation 
    if(!createdDoctor){
        throw new ApiError(500,"Somthing went wrong while registering deatails of doctor")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200,createdDoctor,"Doctor Details registered successfully")
    )

})
export const viewAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find();
    
    if (!doctors) {
        throw new ApiError(404, "No doctors found");
    }

    return res.status(200).json(new ApiResponse(200, doctors, "All doctor details retrieved successfully"));
});
export const addReview = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const  review  = req.body;
    console.log(review);

    const updatedDoctor = await Doctor.findOneAndUpdate(
        { _id: doctorId },
        { $push: { review } },
        { new: true } // This ensures that the updated document is returned
    );
    console.log(updatedDoctor);
    if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json(
        new ApiResponse(200, updatedDoctor, "Doctor review successfully updated")
    );
});

export const addClinic = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { clinicDetails } = req.body;

    try {
        const updatedDoctor = await Doctor.findOneAndUpdate(
            { _id: doctorId },
            { $push: { clinicDetails } },
            { new: true } // This ensures that the updated document is returned
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        return res.status(200).json(
            new ApiResponse(200, updatedDoctor, "Clinic details added successfully")
        );
    } catch (error) {
        // Handle any potential errors
        console.error(error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
})

export const updateClinicDetails = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { clinicId,clinicDetails } = req.body;

    try {
        // const doctor = await Doctor.findById(doctorId)
        
        const updatedClinicDetails = await Doctor.findOneAndUpdate(
            { _id: doctorId, "clinicDetails._id": clinicId },
            { $set: { "clinicDetails.$": clinicDetails } },
            { new: true }
        );
        

        if (!updatedClinicDetails) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        return res.status(200).json(
            new ApiResponse(200, updatedClinicDetails, "Clinic details added successfully")
        );
    } catch (error) {
        // Handle any potential errors
        console.error(error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
})

