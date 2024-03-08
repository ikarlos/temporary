import verifyOtp from "../middlewares/verifyotp.middleware.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponseError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyOtpController = asyncHandler(async (req, res) => {
    const { otp,number } = req.body;
    console.log(req.body);

    try {
        // Ensure that verifyOtp is an asynchronous function that returns a Promise
        const isOtpValid = await verifyOtp(number, otp);
        // console.log(isOtpValid);

        if (isOtpValid) {
            return res.status(202).json(new ApiResponse(203, null, "Otp verified"));
        } else {
            // Handle the case where the OTP is not verified
            console.log("Invalid OTP");
            return res.status(401).json(new ApiError(401, "Invalid OTP"));
        }
    } catch (err) {
        console.log(`${err} Something went wrong`);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
})
export default verifyOtpController