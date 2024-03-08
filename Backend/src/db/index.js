import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const dbConnection = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDb Connected !! Db Host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Connection failed: " +  error);
    }
}

export default dbConnection;
