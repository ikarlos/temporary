import { Doctor } from "../models/doctorDetails.model.js"
import { User } from "../models/user.model.js";
import { Appointment } from "../models/appointment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponseError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// registering appointment details
export const appointmentDetails = asyncHandler(async (req,res)=>{
    // get user detail form front end
    console.log(req.body);
    const {
        patientId,
        doctorId,
        clinicId,
        appointmentTime,
        appointmentDate,
        status
    } = req.body


    // create appointment in db
    const appointment = await Appointment.create({
        patientId,
        doctorId,
        clinicId,
        appointmentTime,
        appointmentDate,
        status
    })

    // check for user creation 
    if(!appointment){
        throw new ApiError(500,"Somthing went wrong while creating Appointment")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200,appointment,"Appoinmtment Details registered successfully")
    )

})
export const updateAppointmentStatus=asyncHandler(async(req,res)=>{
    const {
        appointmentId,
        status
    } = req.body
    try {
        const appointment = await Appointment.findOneAndUpdate(
            {_id:appointmentId},
            {
                $set:{
                    status:status
                }
            }
        )
        if (!appointment) {
            // throw new ApiError(500,"Somthing went wrong while updating status of appointment")
            
            return res.status(404).json({ message: 'Doctor  not found' });
        }
        return res.status(200).json({ message: 'Appointment updated successfully', user: appointment });
      
    } catch (error) {
      
        console.error('Error updating Appointment:', error);
        return res.status(500).json({ message: 'Internal server error' });  
    }
    

})