import { asyncHandler } from "../../utils/asyncHandler.js";
import { Doctor } from "../../models/doctorDetails.model.js";
import { checkIfUserLoggedIn } from "../../middlewares/checkForLogin.middleware.js";
import { Appointment } from "../../models/appointment.model.js";
import { User } from "../../models/user.model.js";
import { Invoice } from "../../models/invoice.model.js";

export const patientDashboard = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const loggedUser = await checkIfUserLoggedIn(refreshToken);
    const userId = loggedUser._id;

    // Fetch appointments for the logged-in patient
    const appointments = await Appointment.find({ patientId: userId });
    const invoices =await Invoice.find({patientId:loggedUser._id})

    // Extract unique doctor IDs from the appointments
    const doctorIds = Array.from(
      new Set(appointments.map((appointment) => appointment.doctorId))
    );

    // Fetch doctor details for each unique doctor ID
    const doctorDetails = await Doctor.find({ _id: { $in: doctorIds } });

    // Extract unique user IDs from the doctor details
    const userIds = Array.from(
      new Set(doctorDetails.map((doctor) => doctor.userId))
    );

    // Fetch user details for each unique user ID
    const doctorUserDetails = await User.find({ _id: { $in: userIds } });

    // Associate doctor details with user details
    const doctorDetailsWithUsers = doctorDetails.map((doctor) => {
      const userDetails = doctorUserDetails.find(
        (user) => user._id.toString() === doctor.userId.toString()
      );
      return { doctor, userDetails };
    });
    

    // Check if doctorDetailsWithUsers is empty
    if (!doctorDetailsWithUsers || doctorDetailsWithUsers.length === 0) {
      // Render the "patient-dashboard" with a message when no doctor details are found
      return res.render("patient-dashboard", {
        loggedUser,
        message: "No appointments found",
        doctorDetailsWithUsers: [], // Empty array since there are no doctor details
        appointments,
        invoices
      });
    }
console.log(doctorDetailsWithUsers);
    res.render("patient-dashboard", {
      loggedUser,
      doctorDetailsWithUsers,
      appointments,
      invoices
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export const viewInvoice=asyncHandler(async(req,res)=>{
const {loggedUser}=req
const {invoiceId}=req.params
const invoice=await Invoice.findById(invoiceId)
const appointment=await Appointment.findById(invoice.appointmentId)
const doctorId=invoice.doctorId
const doctor = await Doctor.findById(doctorId)
const doctorDetails= await User.findOne({_id:doctor.userId})

return res.render("view-invoice", { appointment, doctorDetails, loggedUser, data: invoice });

})