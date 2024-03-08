import generateAcessTokenandRefreshToken from "../../middlewares/generateAccess.middleware.js"
import sendotp from "../../middlewares/sendotp.middleware.js"
import verifyOtp from "../../middlewares/verifyotp.middleware.js"
import { User } from "../../models/user.model.js"
import { ApiError } from "../../utils/apiError.js"
import { ApiResponse } from "../../utils/apiResponseError.js"
import { asyncHandler } from "../../utils/asyncHandler.js"



export const otpFile = asyncHandler(async (req, res) => {
    const {number,fullName,password} = req.body
    if (!number){
        throw new ApiError(409,"number is required")
    }
    
    console.log(number);
    const sendedOtp = sendotp(number)
    return res.render("otp",{number,fullName,password})
    
    
}) 
export const verifyOtpFile=asyncHandler(async (req,res)=>{
    const { otp,number,fullName,password } = req.body;
    console.log(req.body);

    try {
        // Ensure that verifyOtp is an asynchronous function that returns a Promise

        const newno="+91"+number
        const isOtpValid = await verifyOtp(newno, otp);
        console.log(isOtpValid);

        if (isOtpValid) {
            if (
                [fullName, number, password].some((field) => field?.trim() === "")
            
              ) {
                  throw new ApiError(400,"All feilds are required")
              }
              // check if user already exist
              const existeduser= await User.findOne({
                  number 
              })
            if (existeduser) {
              console.log("Existing User:", existeduser);
              return res.status(500).json(
                    new ApiResponse(500,"user alredy exist")
                  )
              }
        
              // create user object in db
              const user=await User.create({
                fullName,
                number,
                password
              })
              const createdUser = await User.findById(user._id).select(
                  "-password -refreshToken"
              )
              // check for user creation 
              if(!createdUser){
                  throw new ApiError(500,"Somthing went wrong while registering new user")
              }
            
              // remove refesh token and response field
              // return response
            
            const { accessToken, refreshToken } = await generateAcessTokenandRefreshToken(user._id);
            
            
              const options = {
                httpOnly: true,
                secure: true,
              };
            
              return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .redirect("/");
              
            
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