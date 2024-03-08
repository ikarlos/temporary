// import { Promise } from "mongoose"

const asyncHandler=(requestHandeler)=>{
    return (req,res,next)=>{
    Promise.resolve(requestHandeler(req,res,next)).catch((err)=>next(err))
}

}
export  {asyncHandler}


















// const asyncHandler =(fn)=>async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             succes:false,
//             message:err.message


//         })
//     }


// }