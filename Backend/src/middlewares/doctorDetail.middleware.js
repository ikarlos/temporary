import { Doctor } from "../models/doctorDetails.model.js";


export const fetchDoctorDetailMiddleware = async (req, res, next) => {
    try {
        const { loggedUser } = req;
        if (!loggedUser) {
            throw new Error("Logged user not found");
        }
        const { _id: userId } = loggedUser;
        const doctorDetail = await Doctor.findOne({ userId });
        if (!doctorDetail) {
            doctorDetail=null

        }else{
        req.doctorDetail = doctorDetail;
        } // Attach the doctor detail to the request object
        next(); // Call next middleware
    } catch (error) {
        // Handle errors
        console.error("Error in fetchDoctorDetailMiddleware:", error);
        res.status(404).json({ message: "Doctor detail not found" });
    }
};