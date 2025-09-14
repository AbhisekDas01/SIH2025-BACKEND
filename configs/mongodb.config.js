import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config.js";


const connectDb = async () => {

    try {
        
        mongoose.connection.on('connected' , () => console.log("Database connected successfully!")
        );

        await mongoose.connect(`${MONGODB_URI}/Community_Health_System`);


    } catch (error) {
        
        console.error('Error while connecting mongodb : ' , error);

        process.exit(1);
    }
}

export default connectDb;