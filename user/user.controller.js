import express from "express";
import Yup from "yup";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import { userValidationSchema } from "./user.validation.js";

const router = express.Router();

//* register user
router.post(
  "/register",
  async (req, res, next) => {
    //extract data from req.body
    const data = req.body;

    userValidationSchema;

    try {
      //validate data
      const validatedData = await userValidationSchema.validate(data);
      req.body = validatedData;
    } catch (error) {
      // if validation fails, throw error
      return res.status(400).send({ message: error.message });
    }

    next();
  },
  async (req, res) => {
    // extract data from req.body
    const newUser = req.body;

    // find the user with email
    const user = await User.findOne({ email: newUser.email });

    // if user exist, throw error
    if (user) {
      return res.status(409).send({ message: "User already exists" });
    }

    // hash password
    const plainPassword = newUser.password;
    const saltRound = 10;

    const hashedPassword = await bcrypt.hash(plainPassword, saltRound);
    newUser.password = hashedPassword;

    // send to DB
    await User.create(newUser);

    // hide password
    newUser.password = undefined;

    // send res
    return res
      .status(200)
      .send({ message: "User Registered successfully", userDetail: newUser });
  }
);

//* login
router.post(
  "/login",
  (req, res, next) => {
    next();
  },
  (req, res) => {
    return res.status(200).send({ message: "Login..." });
  }
);

export default router;
