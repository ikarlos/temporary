import { DB_NAME } from "./constant.js"
import connectDb from "./db/index.js";
import dotenv from "dotenv";
import express from "express";
import { app } from "./app.js";
dotenv.config({
  path: "./env"
})
// const app = express()

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 6000, () => {
      console.log(`The server is Running at Port : ${process.env.PORT}`);
      // console.log( process.env);
    });
  })
  .catch((err) => {
    console.log(`MongoDb connection failed: ${err}`);
  });