import Twilio from "twilio";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponseError.js";

const {TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,TWILIO_SERVICE_SID} = process.env
const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const verifySid = TWILIO_SERVICE_SID;
const client = new Twilio(accountSid, authToken);

const verifyOtp = async (number,userProvidedOtp) => {
    try {
        const verificationCheck = await client.verify.v2.services(verifySid)
            .verificationChecks.create({ to: number, code: userProvidedOtp });

        return verificationCheck.status === 'approved';
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        throw error;
    }
};

export default verifyOtp