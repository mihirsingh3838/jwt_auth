const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "username is required"],
      minLength: [5, "Name must be at least 5 characters"],
      maxLength: [20, "Name cannot be more than 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      require: [true, "email is required"],
      unique: [true, "User already exists"],
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
})

userSchema.methods = {
  jwtToken() {
    return JWT.sign(
      {
        id: this._id,
        email: this.email,
      },
      process.env.SECRET,
      {
        expiresIn: "24h",
      }
    );
  },
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
