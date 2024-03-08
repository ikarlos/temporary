import { checkIfUserLoggedIn } from "../../middlewares/checkForLogin.middleware.js";
import { Appointment } from "../../models/appointment.model.js";
import { Doctor } from "../../models/doctorDetails.model.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const booking = asyncHandler(async (req, res) => {

    const { doctorId } = req.params
    const { refreshToken } = req.cookies;
    const loggedUser = await checkIfUserLoggedIn(refreshToken);
    const doctor = await Doctor.findById(doctorId)
    console.log(doctor);
    const id = doctor.userId
    console.log(id);
    const user = await User.findById(id)

    if (!loggedUser) {
        res.redirect("/login")
    }
    if (!user) {
        res.redirect("/")
    }

    return res.render("booking", { loggedUser, user, doctor })
})
export const clinicBooking = asyncHandler(async (req, res) => {
    const { doctorId, clinicId } = req.params
    const { loggedUser } = req
    const doctor = await Doctor.findById(doctorId)
    const id = doctor.userId
    // console.log(id);
    const user = await User.findById(id)
    const clinic = doctor.clinicDetails.find(clinic => clinic._id.toString() === clinicId);
    // console.log(clinic);

    return res.render("clinic-booking", { doctorId, clinic, loggedUser, doctor, user })


})
export const fetchTime = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { clickedDay, clinicId } = req.body;
    try {
        const doctor = await Doctor.findOne({ 'clinicDetails._id': clinicId });
        const clinic = doctor.clinicDetails.find(clinic => clinic._id.toString() === clinicId);        // Initialize an empty array to store the time slots of the clicked day
        // let timeSlots = [];
        // console.log(clinic.consultationDays);
        // Assuming clinic.consultationDays is the Mongoose document representing consultation days

        const consultationDaysMap = clinic.consultationDays;
        console.log("maps", consultationDaysMap);
        const timeSlots = consultationDaysMap.get(clickedDay)


        // Iterate over the keys (days) in the map
        for (const day of consultationDaysMap.keys()) {
            console.log("day", day, "clikedday", clickedDay);

            if (day == clickedDay) {

                // Access the time slots for the current day
                const timeSlots = consultationDaysMap.get(day);
                console.log(timeSlots);
                return res.status(200).json({ day, timeSlots })

            }
        }
        return res.status(200).json({ message: "no time slots available" })


    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export const confirmAppontment = asyncHandler(async (req, res) => {
    const { day, time, doctorId, clinicId, fees } = req.body
    const { loggedUser } = req

    const clinicIdTrimmed = clinicId.trim();
    console.log("here");
    console.log(day, time);
    const appointment = await Appointment.create({
        doctorId,
        patientId: loggedUser._id,
        clinicId: clinicIdTrimmed,
        fees,
        appointmentDate: day,
        appointmentTime: time
    })
    console.log(appointment);
    if (!appointment) {
        return res.json({ message: "failed" })
    }
    const doctorProfessionalDetail = await Doctor.findOne({ _id: doctorId })
    const doctorPresonalDetail = await User.findOne({ _id: doctorProfessionalDetail.userId })

    return res.render("checkout", { loggedUser, appointment, doctorPresonalDetail, doctorProfessionalDetail, day, time, doctorId, clinicId, fees })
})