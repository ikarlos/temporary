import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {

    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: false,
      lowercase: true,
      trim: true,
      index: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    number: {
      type: Number,
      // required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [128, "Password must be less than 128 characters long"],
      validate: {
        validator: function (value) {
          // Require at least one uppercase letter, one lowercase letter, one special character and one number
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
          return regex.test(value);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
      },
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    gender: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    address: {
      type: String,
    },
    locality: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pincode: {
      type: Number,
    },

    refreshToken: {
      type: String,
    },
  },
  { TimeStamps: true }
);

userSchema.pre("save", async function (next) {
  // if the password is not changed
  if (!this.isModified("password")) return next();

  try {
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
    next();
  } catch (error) {
    return next(error); // Pass the error to the next middleware or route handler
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    // Compare the provided password with the hashed password
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error); // Handle the error appropriately
  }
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      // userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
