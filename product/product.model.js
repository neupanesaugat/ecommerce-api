import mongoose from "mongoose";
import { productCategories } from "../constant/general.constant.js";

// set schema

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 55,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 55,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: productCategories,
    },
    freeShipping: {
      type: Boolean,
      required: false,
      default: false,
    },
    sellerId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
//? whenever json conversion is done (while sending request)
productSchema.methods.toJSON = function () {
  let obj = this.toObject(); //? (it converts bson to json)
  delete obj.sellerId;
  return obj;
};

// create model/collection

const Product = mongoose.model("Product", productSchema);

export default Product;
