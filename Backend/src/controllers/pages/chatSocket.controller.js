import { asyncHandler } from "../../utils/asyncHandler.js";

export const chatSocket = asyncHandler(async (req, res) => {
    const {loggedUser} = req
    // const userId = loggedUser._id
    console.log("hello");
    res.render("chat-doctor",{loggedUser})
})