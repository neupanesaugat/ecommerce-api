import express from "express";
import { isSeller, isUser } from "../middleware/authentication.middleware.js";
import validateMongoIdFromParams from "../middleware/validate.mongo.id.js";
import validateRequestBody from "../middleware/validate.req.body.js";
import checkMongoIdEquality from "../utils/mongo.id.equality.js";
import Product from "./product.model.js";
import {
  addProductValidationSchema,
  paginationDataValidationSchema,
} from "./product.validation.js";

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

//* delete product
router.delete(
  "/delete/:id",
  isSeller,
  validateMongoIdFromParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product using productId
    const product = await Product.findById(productId);

    // if not product found, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist" });
    }

    // check if loggedInUserId is owner of the product
    const isProductOwner = checkMongoIdEquality(
      product.sellerId,
      req.loggedInUserId
    );

    // if not owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not the owner of this product" });
    }

    // delete product
    await Product.findByIdAndDelete(productId);

    // send res
    return res.status(200).send({ message: "Success!" });
  }
);

//* edit product
router.put(
  "/edit/:id",
  isSeller,
  validateMongoIdFromParams,
  validateRequestBody(addProductValidationSchema),
  async (req, res) => {
    // extract productId from req.params
    const productId = req.params.id;

    // find product using product id
    const product = await Product.findById(productId);
    console.log(product);

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist" });
    }

    // check product ownership
    const isProductOwner = checkMongoIdEquality(
      product.sellerId,
      req.loggedInUserId
    );

    // if not product owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product" });
    }

    // extract new values from req.body
    const newValues = req.body;

    // edit product
    await Product.findByIdAndUpdate(productId, newValues); //? not using ... (spread) newValues because we are dealing with database and not with an array

    // send res
    return res
      .status(200)
      .send({ message: "Product has been edited successfully" });
  }
);

//* get product details
router.get(
  "/detail/:id",
  isUser,
  validateMongoIdFromParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product using product id
    const product = await Product.findById(productId);

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // send res
    return res
      .status(200)
      .send({ message: "Success!", productDetails: product });
  }
);

//* list product by seller
router.post(
  "/seller/list",
  isSeller,
  validateRequestBody(paginationDataValidationSchema),
  async (req, res) => {
    //? extract pagination data from req.body
    const { page, limit } = req.body; //? destructure

    //? calculate skip
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      { $match: { sellerId: req.loggedInUserId } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          price: 1,
          brand: 1,
          image: 1,
          description: 1,
        },
      },
    ]);

    return res.status(200).send({ message: "success", productList: products });
  }
);

export default router;
