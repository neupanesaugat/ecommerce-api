import bcrypt from "bcrypt";
import express from "express";
import User from "./user.model.js";
import {
  loginUserValidationSchema,
  userValidationSchema,
} from "./user.validation.js";
import validateRequestBody from "../middleware/validate.req.body.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//* register user
router.post(
  "/register",
  //? validate user
  validateRequestBody(userValidationSchema),

  //? register new user
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

    // send res
    return res
      .status(200)
      .send({ message: "User Registered successfully", userDetail: newUser });
  }
);

//* login
router.post(
  "/login",
  //? validate login credentials
  validateRequestBody(loginUserValidationSchema),

  //? login user
  async (req, res) => {
    // extract loginCredentials from req.body
    const loginCredentials = req.body;

    // find user using email
    const user = await User.findOne({ email: loginCredentials.email });

    // if not user, throw error
    if (!user) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }

    // compare password using bcrypt
    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;
    const password = await bcrypt.compare(plainPassword, hashedPassword);

    // if password don't match, throw error
    if (!password) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }

    // generate token
    const payload = { email: user.email };
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const token = await jwt.sign(payload, secretKey);

    // send res
    return res.status(200).send({
      message: "Login successful !",
      userDetail: user,
      accessToken: token,
    });
  }
);

export default router;
