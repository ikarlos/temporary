import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";


const generateAcessTokenandRefreshToken=async (userId)=>{

    try {
        const user = await User.findById(userId)
        // Generate access token and refresh token
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken=refreshToken
        await user.save({ validateBeforeSave:false })
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while creating acess token")
    }
}
export default generateAcessTokenandRefreshToken