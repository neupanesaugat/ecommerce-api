import express from "express";
import connectDB from "./database-connection/db.connect.js";
import userRoutes from "./user/user.controller.js";
import productRoutes from "./product/product.controller.js";
import cartRoutes from "./cart/cart.controller.js";
import cors from "cors";

const app = express();

// cross origin resource sharing
// to allow requests from frontend

app.use(
  cors({
    origin: "*", //? allow request from all domain
  })
);

// make app use  json
app.use(express.json());

// enable CORS

//connect DB
await connectDB();

// register routes
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);

// handle global error

//assigning port
const PORT = process.env.PORT; //? extracting port from env object to hide PORT number from github

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
