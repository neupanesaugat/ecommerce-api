import mongoose from "mongoose";

// set schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 55,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"], //? should be among these values
  },
  role: {
    type: String,
    required: true,
    enum: ["buyer", "seller"],
  },
});

// create collection(model)
const User = mongoose.model("User", userSchema);

export default User;
