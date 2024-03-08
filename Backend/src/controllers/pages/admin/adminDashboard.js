import { Doctor } from "../../../models/doctorDetails.model.js";
import { User } from "../../../models/user.model.js"
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const doctorList = asyncHandler(async (req, res) => {
    try {
        const { loggedUser } = req;
        const userId = loggedUser._id;

        // Find all doctors
        const doctors = await Doctor.find();

        // Array to store doctor details with associated user details
        const doctorsWithUserDetails = [];

        // Iterate over each doctor to find their associated user details
        for (const doctor of doctors) {
            // Find the user details for the current doctor
            const doctorDetails = await User.findById(doctor.userId);

            // Push the doctor details with associated user details to the array
            doctorsWithUserDetails.push({
                doctor,
                doctorDetails
            });
        }
        console.log(doctorsWithUserDetails);
        // Render the view with the array of doctors and associated user details
        return res.render("admin/doctor-list", { doctorsWithUserDetails });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export const doctorProfile2 = asyncHandler(async (req, res) => {
    const { doctorId } = req.params
    const { loggedUser } = req

    const doctor = await Doctor.findById(doctorId)
    console.log(doctor);
    const id = doctor.userId
    // console.log(id);
    const user = await User.findById(id)
    res.render("admin/doctor-profile", { loggedUser, doctor, user })
})

export const updateDoctorProfile = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { status } = req.body;

    try {
        // Validate the status value
        // if (!['verified', 'pending'].includes(status)) {
        //     return res.status(400).json({ message: 'Invalid status value' });
        // }

        // Update the status of the doctor in the database
        await Doctor.findByIdAndUpdate(doctorId, { status });

        // Send a success response
        res.status(200).json({ message: 'Doctor status updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        // Send an error response
        res.status(500).json({ message: 'Internal server error' });
    }
    res.render("admin/doctor-profile", { loggedUser, doctor, user })
})
export const rejectProfile = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { message } = req.body
    try {
        const doctor =await Doctor.findByIdAndUpdate(doctorId, { status:"rejected",messageFromAdmin:message });
        console.log(doctor);
        return res.redirect(`/admin/doctorList/doctorProfile/${doctorId}`)

    } catch (error) {
        console.log(error);

    }
})