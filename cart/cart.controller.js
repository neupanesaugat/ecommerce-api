import express from "express";
import { isBuyer } from "../middleware/authentication.middleware.js";
import validateRequestBody from "../middleware/validate.req.body.js";
import { addCartItemsValidationSchema } from "./cart.validation.js";
import mongoose from "mongoose";
import checkMongoIdValidity from "../utils/mongo.id.validity.js";
import Product from "../product/product.model.js";
import Cart from "./cart.model.js";
import validateMongoIdFromParams from "../middleware/validate.mongo.id.js";

const router = express.Router();

//* add item to cart
router.post(
  "/add/item",
  isBuyer,
  validateRequestBody(addCartItemsValidationSchema),

  //? validate product id from req.body
  (req, res, next) => {
    const { productId } = req.body;
    //check mongo id validity for productId
    const isValidId = checkMongoIdValidity(productId);

    // if not valid, throw error
    if (!isValidId) {
      return res.status(400).send({ message: "Invalid Mongo ID" });
    }

    //call next function
    next();
  },
  async (req, res) => {
    // extract cart item data form req.body
    const { productId, orderQuantity } = req.body;

    // find product using productID
    const product = await Product.findById(productId);

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product not found!" });
    }

    // check if orderedQuantity does not exceed product quantity
    if (orderQuantity > product.quantity) {
      return res.status(403).send({ message: "Product is outnumbered" });
    }

    // add item to cart
    await Cart.create({
      buyerId: req.loggedInUserId,
      productId,
      orderQuantity,
    });

    //send res
    return res.status(201).send({ message: "Added to cart successfully" });
  }
);

//* flush cart (remove all items from cart)
router.delete("/flush", isBuyer, async (req, res) => {
  // extract buyerId from req.loggedInUserId
  const buyerId = req.loggedInUserId;
  // remove al; items from cart for that buyer
  await Cart.deleteMany({ buyerId: buyerId });

  // send res
  return res.status(200).send({ message: "Cart cleared successfully" });
});

//* removes single item from cart
//? id => cardId
router.delete(
  "/item/delete/:id",
  isBuyer,
  validateMongoIdFromParams,
  async (req, res) => {
    // extract cardId from req.params
    const cartId = req.params.id;

    // check cart ownership
    const cart = await Cart.findOne({
      _id: cartId,
      buyerId: req.loggedInUserId,
    });

    // if not cart, throw error
    if (!cart) {
      return res
        .status(403)
        .send({ message: "You are not the owner of this cart" });
    }

    // delete cart
    await Cart.deleteOne({ _id: cartId, buyerId: req.loggedInUserId });

    // send res
    return res.status(200).send({ message: "Item deleted successfully" });
  }
);

export default router;
