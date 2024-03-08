
import mongoose from "mongoose";
import { User } from "./user.model.js";
const Schema = mongoose.Schema;
const ConsultationDateTime = new Schema({
  day: String,
  time: [String]
});

const ClinicDetailsSchema = new Schema({
  clinicName: String,
  address: String,
  city: String,
  state: String,
  consultationFee: String,
  consultationDays: {
      type: Map,
      of: [String] // Array of time slots
  }
});



const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User },
  rating: Number,
  comment: String,
  visibility: {
    type: String,
    enum: ["hidden", "visible"],
    default: "visible",

  }
})

const DoctorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User },
  medicalLicense: String,
  specialty: String,
  RgistrationNumber: String,
  medicalRegistration: String,
  registeredCouncil: String,
  registrationYear: { type: Number },
  degree: String,
  consultationfees: String,

  college: String,
  yearsOfCompletion: Number, // Corrected typo in the property name
  experience: String,
  status: { type: String, enum: ["verified","approved", "pending","rejected"], default: "pending" },
  idProof: String,
  establishmentProof: String, // Corrected typo in the property name
  messageFromAdmin:String,
  vedioCallConsultationDays: {
    type: Map,
    of: [String] // Array of time slots
},

  clinicDetails: [ClinicDetailsSchema],
  review: [ReviewSchema]
});

export const Doctor = mongoose.model("Doctor", DoctorSchema);
export const ClinicDetails = mongoose.model("ClinicDetails", ClinicDetailsSchema);