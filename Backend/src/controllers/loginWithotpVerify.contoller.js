import verifyOtp from "../middlewares/verifyotp.middleware.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponseError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateAcessTokenandRefreshToken from "../middlewares/generateAccess.middleware.js"; // Update the path
import { User } from "../models/user.model.js";
const loginVerifyOtpController = asyncHandler(async (req, res) => {
    const { otp, number } = req.body;
    console.log(req.body);

    try {
        // Ensure that verifyOtp is an asynchronous function that returns a Promise
        const isOtpValid = await verifyOtp(number, otp);

        if (isOtpValid) {
            // If OTP is valid, generate access token and refresh token
            const userId = await User.findOne({ number }) /* get the user id based on the verified OTP */;
            console.log(userId);
            const { accessToken, refreshToken } = await generateAcessTokenandRefreshToken(userId._id);
            
        const options = {
            httpOnly: true,
            secure: true,
            };

            // Respond with success and the generated tokens
            return res
            .status(202)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(203, { accessToken, refreshToken,user_id: userId._id  }, "Otp verified and tokens generated"));
        } else {
            // Handle the case where the OTP is not verified
            console.log("Invalid OTP");
            return res.status(401).json(new ApiError(401, "Invalid OTP"));
        }
    } catch (err) {
        console.log(`${err} Something went wrong`);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});

export default loginVerifyOtpController;
