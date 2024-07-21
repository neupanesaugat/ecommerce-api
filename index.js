import express from "express";
import connectDB from "./database-connection/db.connect.js";
import userRoutes from "./user/user.controller.js";

const app = express();

// make app use  json
app.use(express.json());

// enable CORS

//connect DB
await connectDB();

// register routes
app.use("/user", userRoutes);

// handle global error

//assigning port
const PORT = process.env.PORT; //? extracting port from env object to hide PORT number from github

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
