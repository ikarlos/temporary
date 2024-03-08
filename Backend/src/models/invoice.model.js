import mongoose from "mongoose";
import { User } from "./user.model.js";
const Schema = mongoose.Schema;
const invoiceSchema = new Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    paymentDetails: {
        merchantId: String,
        merchantTransactionId: String,
        transactionId: String,
        amount: Number,
        state: String,
        responseCode: String,
        paymentInstrument: {
            type: {
                type: String
            },
            cardType: String,
            pgTransactionId: String,
            bankTransactionId: String,
            pgAuthorizationCode: String,
            arn: String,
            bankId: String,
            brn: String
        }
    }
}, { timestamps: true });

export const Invoice = mongoose.model('Invoice', invoiceSchema);

