import { Doctor } from "../../models/doctorDetails.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"

export const accounts =asyncHandler(async (req,res)=>{
    const { loggedUser } = req

    if (loggedUser.isDoctor) {
        const doctorDetail=Doctor.findOne({userId:loggedUser._id})
        return res.render("accounts",{loggedUser,doctorDetail})
    }else{
        return res.render("patient-accounts",{loggedUser})
    }
})


export const ecash=asyncHandler(async(req,res)=>{
    const {loggedUser}=req
    return res.render("E-Cash",{loggedUser})
})

export const medrecFile=asyncHandler(async(req,res)=>{
    const {loggedUser}=req
    return res.render("medical-records",{loggedUser})
})

export const meddecFile=asyncHandler(async(req,res)=>{
    const {loggedUser}=req
    return res.render("medical-details",{loggedUser})
})