import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
// logging user out
export const logoutFile = asyncHandler(async (req, res) => { 
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.redirect("/")
    }
  
    try {
      // Find the user based on the refresh token
      const {loggedUser}= req

        const userDetail=await User.findOne({id:loggedUser._id})
        
      if (!loggedUser) {
        return res.redirect("/")
      }
  
      // Invalidate the refresh token
      loggedUser.refreshToken = null;
      await loggedUser.save();
  
        // res.json({ message: 'Logout successful' });
        
        // Clear the refresh token cookie
        res.clearCookie('refreshToken');
        
        return res.redirect("/")
    } catch (error) {
      console.error(error);
      res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
    }
})