import axios from "axios";
import { asyncHandler } from "../../utils/asyncHandler.js";
import sha256 from "sha256";
import uniqid from "uniqid";
import { Doctor } from "../../models/doctorDetails.model.js";
import { User } from "../../models/user.model.js";
import { Invoice } from "../../models/invoice.model.js";
import { Appointment } from "../../models/appointment.model.js";
// UAT environment
const MERCHANT_ID = process.env.MERCHANT_ID;
const PHONE_PE_HOST_URL = process.env.PHONE_PE_HOST_URL;
const SALT_INDEX = process.env.SALT_INDEX;
const SALT_KEY = process.env.SALT_KEY;
const APP_BE_URL = process.env.APP_BE_URL;


export const paymentController = asyncHandler(async (req, res) => {
    const { day, time, doctorId, clinicId, fees } = req.body
    const { loggedUser } = req

    console.log("Merchant ID:", MERCHANT_ID);
    console.log("PhonePe Host URL:", PHONE_PE_HOST_URL);
    console.log("Salt Index:", SALT_INDEX);
    console.log("Salt Key:", SALT_KEY);
    console.log("App BE URL:", APP_BE_URL);

    const clinicIdTrimmed = clinicId.trim();
    console.log(day, time);
    const appointment = await Appointment.create({
        doctorId,
        patientId: loggedUser._id,
        clinicId: clinicIdTrimmed,
        fees,
        appointmentDate: day,
        appointmentTime: time
    })
    console.log(appointment);
    if (!appointment) {
        return res.json({ message: "failed" })
    }
    const doctorProfessionalDetail = await Doctor.findOne({ _id: doctorId })
    const doctorPresonalDetail = await User.findOne({ _id: doctorProfessionalDetail.userId })
    console.log(req.body);
    // Transaction amount
    const { amount } = req.params;

    // User ID is the ID of the user present in our application DB
    let userId = "MUID123";

    // Generate a unique merchant transaction ID for each transaction
    let merchantTransactionId = uniqid();

    // redirect url => phonePe will redirect the user to this url once payment is completed. It will be a GET request, since redirectMode is "REDIRECT"
    let normalPayLoad = {
        merchantId: MERCHANT_ID, //* PHONEPE_MERCHANT_ID . Unique for each account (private)
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userId,
        amount: amount * 100, // converting to paise
        redirectUrl: `${APP_BE_URL}/payment/validate/${merchantTransactionId}/${appointment._id}`,
        redirectMode: "REDIRECT",
        mobileNumber: "9999999999",
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };

    // make base64 encoded payload
    let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
    let base64EncodedPayload = bufferObj.toString("base64");

    // X-VERIFY => SHA256(base64EncodedPayload + "/pg/v1/pay" + SALT_KEY) + ### + SALT_INDEX
    let string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

    axios
        .post(
            `${PHONE_PE_HOST_URL}/pg/v1/pay`,
            {
                request: base64EncodedPayload,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": xVerifyChecksum,
                    accept: "application/json",
                },
            }
        )
        .then(function (response) {
            console.log("response->", JSON.stringify(response.data));
            res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
        })
        .catch(function (error) {
            res.send(error);
        });
});
export const paymentValidator = asyncHandler(async (req, res) => {
    const { merchantTransactionId } = req.params;
    // check the status of the payment using merchantTransactionId
    if (merchantTransactionId) {
        let statusUrl =
            `${PHONE_PE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/` +
            merchantTransactionId;

        // generate X-VERIFY
        let string =
            `/pg/v1/status/${MERCHANT_ID}/` + merchantTransactionId + SALT_KEY;
        let sha256_val = sha256(string);
        let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

        try {
            const response = await axios.get(statusUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": xVerifyChecksum,
                    "X-MERCHANT-ID": merchantTransactionId,
                    accept: "application/json",
                },
            });

            if (response.data && response.data.code === "PAYMENT_SUCCESS") {
                // Update appointment status to "scheduled"
                console.log(response.data);
                const { appointmentId } = req.params;
                const appointment = await Appointment.findByIdAndUpdate(
                    appointmentId,
                    {
                        $set: {
                            status: "scheduled"
                        }
                    },
                    { new: true } // Return the updated document
                );

                if (appointment) {
                    // Create the invoice with payment details
                    const invoice = await Invoice.create({
                        appointmentId: appointment._id,
                        patientId: appointment.patientId,
                        doctorId: appointment.doctorId,
                        clinicId: appointment.clinicId,
                        appointmentTime: appointment.appointmentTime,
                        appointmentDate: appointment.appointmentDate,
                        fees: parseFloat(appointment.fees),
                        paymentStatus: 'completed',
                        paymentDetails: {
                            merchantId: response.data.data.merchantId,
                            merchantTransactionId: response.data.data.merchantTransactionId,
                            transactionId: response.data.data.transactionId,
                            amount: response.data.data.amount,
                            state: response.data.data.state,
                            responseCode: response.data.data.responseCode,
                            paymentInstrument: response.data.data.paymentInstrument
                        }
                    });

                    // Remove booked time slot from clinic details
                    // Remove booked time slot from clinic details
                    const doctorUpdate = await Doctor.findOne({ "clinicDetails._id": appointment.clinicId });
                    if (doctorUpdate) {
                        const clinicDetails = doctorUpdate.clinicDetails.find(detail => detail._id.toString() === appointment.clinicId);
                        if (clinicDetails) {
                            const updatedConsultationDays = clinicDetails.consultationDays.get(appointment.appointmentDate);
                            
                            if (updatedConsultationDays) {
                                const index = updatedConsultationDays.indexOf(appointment.appointmentTime);
                                if (index !== -1) {
                                    updatedConsultationDays.splice(index, 1);
                                    clinicDetails.consultationDays.set(appointment.appointmentDate, updatedConsultationDays);
                                    await doctorUpdate.save();
                                    console.log("Clinic details updated successfully");
                                } else {
                                    console.log("Appointment time not found in consultation days");
                                }
                            } else {
                                console.log("No consultation days found for the appointment date");
                            }
                        } else {
                            console.log("Clinic details not found");
                        }
                    } else {
                        console.log("Doctor not found");
                    }


                    // Proceed with rendering invoices page
                    const { loggedUser } = req;
                    const doctor = await Doctor.findById(appointment.doctorId);
                    const doctorDetails = await User.findById(doctor.userId);
                    console.log("Invoice created:", invoice); // Log the created invoice
                    // Render invoices page with appointment data
                    return res.render("invoices", { appointment, doctorDetails, loggedUser, data: response.data });
                } else {
                    // Handle case where appointment is not found
                    return res.status(404).send("Appointment not found");
                }
            } else {
                // Redirect to FE payment failure / pending status page
            }
        } catch (error) {
            // Handle errors
            console.error("Error:", error);
            // Redirect to FE payment failure / pending status page
            res.send(error);
        }
    } else {
        res.send("Sorry!! Error");
    }
});





export const invoice = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { loggedUser } = req

    const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
            $set: {
                status: "scheduled"
            }
        },
        { new: true } // This ensures that `appointment` contains the updated document
    );

    if (appointment) {
        console.log(appointment);
        // Assuming you need to pass appointment data to the invoices page for rendering
        return res.render("invoices", { appointment, loggedUser });
    } else {
        // Handle case where appointment is not found
        return res.status(404).send("Appointment not found");
    }
});

export const successPage = asyncHandler(async (req, res) => {
    res.send("<h1>Payment successfully</h1>");
});
