import generateAcessTokenandRefreshToken from "../../middlewares/generateAccess.middleware.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/apiResponseError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { updateUser } from "../user.controllers.js";
// login file
export const loginFile = asyncHandler(async (req, res) => {
  res.render("login", { loggedUser: "none" })
})
export const middlewarelogin = asyncHandler(async (req, res) => {
  const { refreshToken } = req.params
  res.render("middleware", { refreshToken })
})
export const loginUser = asyncHandler(async (req, res) => {
  const { email, number, password, refreshToken } = req.body;
  // console.log(refreshToken);
  if (refreshToken) {
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
    return res.status(302).redirect("/login?message=number is required&loggedUser=none");

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
      .redirect(`/middlewarelogin/${refreshToken}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const registerFile = asyncHandler(async (req, res) => {
  res.render("Register", { loggedUser: "none" })
})
// middlewareRegister
export const middlewareRegister = asyncHandler(async (req, res) => {
  const { refreshToken } = req.params
  res.render("middlewareRegister", { refreshToken })
})
export const registerDoctorFile = asyncHandler(async (req, res) => {
  res.render("doctor-register")
})
export const middlewareDoctorRegister = asyncHandler(async (req, res) => {
  const { refreshToken } = req.params
  res.render("middlewareDoctorRegister", { refreshToken })
})

export const userRegister = asyncHandler(async (req, res) => {
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
    throw new ApiError(400, "All feilds are required")
  }
  // check if user already exist
  const existeduser = await User.findOne({
    number
  })
  if (existeduser) {
    console.log("Existing User:", existeduser);
    return res.redirect("/register?message=user already exist&loggedUser=none")
  }
  // create user object in db
  const user = await User.create({
    fullName,
    number,
    password
  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  // check for user creation 
  if (!createdUser) {
    res.redirect("/register?message=something went worng &loggedUser=none")
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
    // .cookie("accessToken", accessToken, options)
    // .cookie("refreshToken", refreshToken, options)
    .redirect(`/middlewareRegister/${refreshToken}`);
})

export const doctorRegister = asyncHandler(async (req, res) => {
  const { fullName, number, password, isDoctor } = req.body
  // validation -not empty
  if (
    [fullName, number, password].some((field) => field?.trim() === "")

  ) {
    throw new ApiError(400, "All feilds are required")
  }
  // check if user already exist
  const existeduser = await User.findOne({
    number
  })
  if (existeduser) {
    console.log("Existing User:", existeduser);
    return res.status(500).json(
      res.redirect("/doctor-register?message=something went worng &loggedUser=none")
    )
  }

  // create user object in db
  const user = await User.create({
    fullName,
    number,
    password,
    isDoctor
  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  // check for user creation 
  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while registering new user")
  }
  const { accessToken, refreshToken } = await generateAcessTokenandRefreshToken(user._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    // .cookie("accessToken", accessToken, options)
    // .cookie("refreshToken", refreshToken, options)
    .redirect(`/middlewareDoctorRegister/${refreshToken}`);


})

export const userRegisterFileStep1 = asyncHandler(async (req, res) => {
  return res.render("patient-register-step1")
})

export const userRegisterFileStep2 = asyncHandler(async (req, res) => {
  return res.render("userRegisterFileStep1")
})

export const userUpdateStep1 = asyncHandler(async (req, res) => {
  const { loggedUser } = req
  const { email } = req.body
  let avatar = req.files?.avatar?.[0]?.path;
  if (!avatar) {
    avatar="default"
 
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: loggedUser._id },
    {
      $set: {

        email,
        avatar
      }
    },
    {
      new: true // Option to return the updated document
    }
  );


  if (!updatedUser) {
    return res.redirect("/login")
  }
  return res.render("patient-register-step2")
})
export const userUpdateStep2 = asyncHandler(async (req, res) => {
  const { loggedUser } = req
  const { gender, bloodGroup, language } = req.body
  const updatedUser = await User.findOneAndUpdate(
    { _id: loggedUser._id },
    {
      $set: {
        gender,
        bloodGroup,
        language
      }
    },
    {
      new: true // Option to return the updated document
    }
  )
  if (!updatedUser) {
    return res.redirect("/login")
  }
  console.log("update user");
  return res.render("patient-register-step3")


})

export const userUpdateStep3 = asyncHandler(async (req, res) => {
  const { loggedUser } = req
  const {
    address,
    locality,
    city,
    state,
    pincode

  } = req.body
  const updatedUser = await User.findOneAndUpdate(
    { _id: loggedUser._id },
    {
      $set: {

        address,
        locality,
        city,
        state,
        pincode
      }
    },
    {
      new: true // Option to return the updated document
    }
  )
  if (!updatedUser) {
    return res.redirect("/login")
  }
  return res.redirect("/patientDashboard")

})