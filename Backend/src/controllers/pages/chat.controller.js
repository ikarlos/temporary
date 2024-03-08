import { asyncHandler } from "../../utils/asyncHandler.js";

export const  chatFile=asyncHandler(async (req,res)=>{
    const {loggedUser}=req
    console.log(loggedUser);
    return res.render("chat",{loggedUser})

})