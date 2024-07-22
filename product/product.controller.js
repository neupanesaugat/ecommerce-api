import express from "express";
import Product from "./product.model.js";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import {
  isBuyer,
  isSeller,
  isUser,
} from "../middleware/authentication.middleware.js";
import validateRequestBody from "../middleware/validate.req.body.js";
import { addProductValidationSchema } from "./product.validation.js";

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
  isSeller,
  validateRequestBody(addProductValidationSchema),
  async (req, res) => {
    // extract newProduct from req.body
    const newProduct = req.body;
    newProduct.sellerId = req.loggedInUserId;

    await Product.create(newProduct);
    return res.status(201).send({ message: "Product added successfully" });
  }
);

export default router;
