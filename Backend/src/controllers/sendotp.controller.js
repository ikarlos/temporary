import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponseError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import sendotp  from "../middlewares/sendotp.middleware.js"

export const sendOtpController = asyncHandler(async (req, res) => {
    const {number} = req.body
    if (!number){
        throw new ApiError(409,"number is required")
    }
    const sendedOtp = sendotp(number)
    
    return res.status(201).json(
        new ApiResponse(200,sendedOtp,"otp sent")
    )
}) 
