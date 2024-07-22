import express from "express";
import Product from "./product.model.js";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import { isSeller, isUser } from "../middleware/authentication.middleware.js";

const router = express.Router();

//* list all products
router.get("/list", isUser, async (req, res) => {
  // find all products
  const products = await Product.find();
  return res.status(200).send({ message: "success", productList: products });
});

//* add product
router.post(
  "/add",
  (req, res, next) => {
    isSeller;
    next();
  },
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  (req, res) => {
    return res.status(201).send({ message: "Adding product..." });
  }
);

export default router;
