import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';

const secretKey = process.env.REFRESH_TOKEN_SECRET; // Replace with your actual secret key

export const checkIfUserLoggedIn = async (refreshToken) => {
    try {
        if (!refreshToken) {
            console.log("Refresh token not provided");
            return null;
        }

        const decoded = jwt.verify(refreshToken, secretKey);
        // console.log(decoded);
        const user = await User.findById(decoded._id).select('-password -refreshToken');

        if (!user) {
            console.log("User not found");
            return null;
        }

        console.log("User is logged in");
        return user;
    } catch (error) {
        console.error("Error checking user login:", error);
        // Handle errors or log them as needed
        return null;
    }
};
