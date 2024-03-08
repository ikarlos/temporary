// Import necessary modules and controllers
import { Router } from "express";
import { loginUser, registerUser, logoutUser, updateUser, viewAllUsers } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.midleware.js";
import { sendOtpController } from "../controllers/sendotp.controller.js";
import verifyOtpController from "../controllers/verifyotp.controller.js";
import verifyAccessToken from "../middlewares/verifyAccessToken.middleware.js";
import loginVerifyOtpController from "../controllers/loginWithotpVerify.contoller.js";

// Create a router instance
const router = Router();

router.route("/user").get(viewAllUsers)

// Registration route with avatar upload and OTP verification
router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  },
]), registerUser);

// Send OTP for registration
router.route("/register/sendotp").post(sendOtpController);

// Verify OTP for registration
router.route("/register/verifyotp").post(verifyOtpController);

// Login route
router.route("/login").post(loginUser);

// Login with OTP route
router.route("/login/sendotp").post(sendOtpController); // Reusing the same sendOtpController for login

// Verify OTP for login
router.route("/login/verifyotp").post(loginVerifyOtpController);


// Logout route
router.route("/logout").post(logoutUser);

// Protected route that requires access token verification
router.route("/protectedroute").get(verifyAccessToken, (req, res) => {
  res.json({
    message: "Access Granted",
  });
});


router.route("/updateUser/:userId").put(upload.fields([
    {
        name: "avatar",
        maxCount: 1,
      }
]),updateUser);


// Export the router
export default router;
