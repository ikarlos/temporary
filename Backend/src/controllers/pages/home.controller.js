import { checkIfUserLoggedIn } from "../../middlewares/checkForLogin.middleware.js";
import { Appointment } from "../../models/appointment.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponseError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const homePage=asyncHandler(async (req,res)=>{
    
    const {loggedUser}= req
    
    if (loggedUser) {

        // console.log("logged", imagePath);

        return res.render("ambulance",{loggedUser})
    }
    return res.render("ambulance",{loggedUser:"none"})  
})
export const labtestFile=asyncHandler(async (req,res)=>{
    const {loggedUser}= req
    
    if (loggedUser) {

        // console.log("logged", imagePath);

        return res.render("index-12",{loggedUser})
    }
    return res.render("index-12",{loggedUser:"none"})  
})  
    
export const radiologyFile=asyncHandler(async (req,res)=>{
    const {loggedUser}= req
    
    if (loggedUser) {

        // console.log("logged", imagePath);

        return res.render("Radiology",{loggedUser})
    }
    return res.render("Radiology",{loggedUser:"none"})  
})

export const searchDoctorsPageFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("index-3",{loggedUser})
    }
    return res.render("index-3",{loggedUser:"none"})
})
export const videoConsultFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("chat",{loggedUser})
    }
    return res.render("chat",{loggedUser:"none"})
})

export const ambulanceFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("ambulance",{loggedUser})
    }
    return res.render("ambulance",{loggedUser:"none"})
})
export const oxygenFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("oxygen",{loggedUser})
    }
    return res.render("oxygen",{loggedUser:"none"})
})

export const aboutFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("about-us",{loggedUser})
    }
    return res.render("about-us",{loggedUser:"none"})
})

export const termFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("term-condition",{loggedUser})
    }
    return res.render("term-condition",{loggedUser:"none"})
})

export const refundpage=(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("refund-policy",{loggedUser})
    }
    return res.render("refund-policy",{loggedUser:"none"})
})

export const privacyFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("privacy-policy",{loggedUser})
    }
    return res.render("privacy-policy",{loggedUser:"none"})
})

export const contactFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("contact-us",{loggedUser})
    }
    return res.render("contact-us",{loggedUser:"none"})
})


export const pricingFile=asyncHandler(async(req, res)=>{
    const {loggedUser} = req

    if(loggedUser) {
        return res.render("ambulancePricing",{loggedUser})
    }
    return res.render("ambulancePricing",{loggedUser:"none"})
})