import { asyncHandler } from "../../utils/asyncHandler.js";
import { Doctor } from "../../models/doctorDetails.model.js";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import { Appointment } from "../../models/appointment.model.js";
import { User } from "../../models/user.model.js";
import { ClinicDetails } from "../../models/doctorDetails.model.js";

export const myClincs = asyncHandler(async (req, res) => {
    const {loggedUser} = req
    const userId = loggedUser._id
    const doctorDetail = await Doctor.findOne({ userId })
    const Appointments = await Appointment.find({ doctorId: doctorDetail._id })
    const patients = await User.find()
    res.render("my-clinics", { loggedUser, doctorDetail })
})

export const deleteClinic = asyncHandler(async (req, res) => {
    console.log("hitting");
    const clinicId = req.params.clinicId;

    const { loggedUser } = req;
    const userId = loggedUser._id;

    // Use the positional operator ($) to match the clinic in the array by its _id
    const clinic = await Doctor.findOneAndUpdate(
        { userId, "clinicDetails._id": clinicId }, 
        { $pull: { clinicDetails: { _id: clinicId } } },
        { new: true }
    );

    console.log(clinic);
    if (!clinic) {
        return res.send("error in deleting ")
    }
    // return res.send("<p> Clinic deleted successfully </p>");
    return res.json({ message: "Clinic deleted successfully" });
});

// here we listing all patients related to clinic
export const doctorDashboard = asyncHandler(async (req, res) => {
    const clinicId = req.params.clinicId;
    // if (!refreshToken) {
    //     return res.redirect("/login");
    // }

    const {loggedUser} = req
    console.log(loggedUser);
    const userId = loggedUser._id;
    const doctorDetail = await Doctor.findOne({ userId });


    const Appointments = await Appointment.find({ clinicId,status:"scheduled" });
    const patients = [];
    for (const appointment of Appointments) {
        const patient = await User.findById(appointment.patientId);
        patients.push(patient);
    }

    if (doctorDetail) {
        return res.render("doctor-dashboard", { doctorDetail, loggedUser, Appointments, patients,clinicId});
    } else {
        // return res.send("you are not a doctor")
        return res.render("doctor-register-step-1");
    }
})

export const getAppointments = asyncHandler(async (req, res) => {
    const { loggedUser, doctorDetail } = req; // Access logged-in user from the request object

    const Appointments = await Appointment.find({ doctorId: doctorDetail._id })

    console.log(Appointments);

    const patients = await User.find()
    console.log(patients);


    res.render("appointments",{loggedUser,doctorDetail,Appointments,patients})
})

export const appointmentAccept = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params
    const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId },
        {
            $set: {
                status: "completed"
            }
        }, {
        new: true
    }

    )
    const clinicId=appointment.clinicId
    res.redirect(`/myClinic/mypatientHistory/${clinicId}`)
})
export const patientHistory = asyncHandler(async (req, res) => {
    const clinicId = req.params.clinicId;
    const { loggedUser, doctorDetail } = req; // Access logged-in user from the request object
    const Appointments = await Appointment.find({ clinicId, status: "completed" })
    const patients = await User.find()
    res.render("my-patients", { doctorDetail, patients, loggedUser,Appointments,clinicId })
})

export const scheduleTiming = asyncHandler(async (req, res) => {
    const clinicId = req.params.clinicId;
    const { loggedUser } = req;

    console.log("Request Clinic ID:", clinicId);

    try {
        const doctor=await Doctor.findOne({userId:loggedUser._id})
        const clinicDetail = doctor.clinicDetails.find(clinic => clinic._id.toString() === clinicId);
        console.log(clinicDetail);
        // Convert clinicId to ObjectId if it's a string
        // const clinicObjectId = new mongoose.Types.ObjectId(clinicId);


        // Fetch clinic details including consultationDays
        // const clinicDetail = await ClinicDetails.findOne({ _id: clinicObjectId });

        console.log("Clinic Detail:", clinicDetail);

        // Check if clinicDetail is not null before accessing properties
        if (clinicDetail) {
            console.log(clinicDetail.consultationDays);

            // Pass the clinicDetail object to the view
            res.render("schedule-timings", { loggedUser, clinicId,clinic: clinicDetail });
        } else {
            // Handle the case where clinicDetail is null (document not found)
            console.error(`Clinic with ID ${clinicId} not found`);
            res.status(404).send("Clinic not found");
        }
    } catch (error) {
        // Log and handle any potential errors during the query
        console.error("Error fetching clinic details:", error);
        res.status(500).send("Internal Server Error");
    }
});




 export const invoiceFile = asyncHandler(async (req,res)=>{
    const clinicId = req.params.clinicId;
    const {loggedUser} = req
    const userId = loggedUser._id;
    const doctorDetail = await Doctor.findOne({ userId });
    res.render("invoices",{loggedUser,clinicId,doctorDetail})
 })

 export const accountFile = asyncHandler(async (req,res)=>{
    const clinicId = req.params.clinicId;
    const {loggedUser} = req
    const userId = loggedUser._id;
    const doctorDetail = await Doctor.findOne({ userId });
    res.render("accounts",{loggedUser,clinicId,doctorDetail})
 })

 export const messageFile = asyncHandler(async (req,res)=>{
    const clinicId = req.params.clinicId;
    const {loggedUser} = req
    const userId = loggedUser._id;
    const doctorDetail = await Doctor.findOne({ userId });
    res.render("chat",{loggedUser,clinicId,doctorDetail})
 })

 export const reviewFile = asyncHandler(async (req,res)=>{
    const clinicId = req.params.clinicId;
    const {loggedUser} = req
    const userId = loggedUser._id;
    const doctorDetail = await Doctor.findOne({ userId });
    res.render("Review",{loggedUser,clinicId,doctorDetail})
 })

 export const contactFile = asyncHandler(async (req,res)=>{
    const clinicId = req.params.clinicId;
    const {loggedUser} = req
    const userId = loggedUser._id;
    const doctorDetail = await Doctor.findOne({ userId });
    res.render("Review",{loggedUser,clinicId,doctorDetail})
 })
