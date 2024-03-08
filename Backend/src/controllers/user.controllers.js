import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponseError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import generateAcessTokenandRefreshToken from "../middlewares/generateAccess.middleware.js";
import { checkIfUserLoggedIn } from "../middlewares/checkForLogin.middleware.js";

export const registerUser = asyncHandler(async (req,res)=>{
  // get user detail form front end
  const {
      fullName,
      number,
      password
  } = req.body

  // validation -not empty
  if (
    [fullName, number, password].some((field) => field?.trim() === "")

  ) {
      throw new ApiError(400,"All feilds are required")
  }
  // check if user already exist
  const existeduser= await User.findOne({
      number 
  })
if (existeduser) {
  console.log("Existing User:", existeduser);
  return res.status(500).json(
        new ApiResponse(500,"user alredy exist")
      )
  }

  // create user object in db
  const user=await User.create({
    fullName,
    number,
    password
  })
  const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
  )
  // check for user creation 
  if(!createdUser){
      throw new ApiError(500,"Somthing went wrong while registering new user")
  }

  // remove refesh token and response field
  // return response

  const { accessToken, refreshToken } = await generateAcessTokenandRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect("/");
  

})

// logging in user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, number, password, refreshToken } = req.body;
  // console.log(refreshToken);
  if(refreshToken){
    const loggedUser = await checkIfUserLoggedIn(refreshToken);

  if (loggedUser) {
    console.log("User is already logged in");
    const loggedInUserDetail = await User.findById(loggedUser._id).select("-password -refreshToken");
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user_id: loggedUser._id,
          data: loggedInUserDetail,
        },
        "User already logged in"
      )
    );
  }

  }

  

  if (!number && !email) {
    throw new ApiError(400, "Email or password is required");
  }

  try {
    let user;

    if (!email) {
      console.log(number);
      user = await User.findOne({
        $or: [{ number }],
      });
    } else {
      user = await User.findOne({
        $or: [{ number }, { email }],
      });
    }

    if (!user) {
      return res.status(302).redirect("/login?message=invalid number&loggedUser=none");

    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(302).redirect("/login?message=incorrect password&loggedUser=none");
    }

    const { accessToken, refreshToken } = await generateAcessTokenandRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// logging user out
export const logoutUser = asyncHandler(async (req, res) => { 
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized: Refresh token missing' });
    }
  
    try {
      // Find the user based on the refresh token
      const user = await User.findOne({ refreshToken });
  
      if (!user) {
        return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
      }
  
      // Invalidate the refresh token
      user.refreshToken = null;
      await user.save();
  
      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
    }
})


// Update user details
export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
try {
  const {
    fullName,
    email,
    number,
    password,
    isDoctor,
    avatar,
    gender,
    bloodGroup,
    address,
    locality,
    city,
    state,
    country,
    pincode,
    language,

  } = req.body
  
  const avatarLocalPath=req.files?.avatar[0].path
    const updatedUser = await User.findOneAndUpdate(
    
      { _id: userId },
      {
        $set: {
          fullName,
          avatar:avatarLocalPath?avatarLocalPath :" " ,
          email,
          password,
          number,
          isDoctor,
          gender,
          bloodGroup,
          address,
          locality,
          city,
          state,
          country,
          pincode,
          language
      } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


export const viewAllUsers = asyncHandler(async (req, res) => {
  const user = await User.find();
  
  if (!user) {
      throw new ApiError(404, "No user found");
  }

  return res.status(200).json(new ApiResponse(200, user, "All doctor details retrieved successfully"));
});