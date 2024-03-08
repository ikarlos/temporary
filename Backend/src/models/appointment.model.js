import mongoose from "mongoose";
const Schema = mongoose.Schema;
const AppointmentSchema = new Schema({
  appointmentNumber: { 
      type: String,
      // required: true,
      unique: true
  },
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  clinicId: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  fees: String,
  status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "Pending"],
      default: "Pending",
  },
  createdAt: { type: Date, default: Date.now } // Added createdAt field
});

const videoCallAppointmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  appointmentTime: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  fees: String,
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled", "Pending"],
    default: "Pending",
  },

})

// Pre-save hook to generate appointment number
AppointmentSchema.pre('save', function(next) {
  // Generate a unique appointment number using ObjectId and custom prefix
  const appointmentNumber = 'APP-' + this._id.toString().slice(-6); // You can customize the prefix and length as needed
  this.appointmentNumber = appointmentNumber;
  next();
});
export const Appointment = mongoose.model("Appointment", AppointmentSchema);
export const videoCallAppointment = mongoose.model("videoCallAppointment", videoCallAppointmentSchema);
// module.exports = Appointment;
