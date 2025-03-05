import mongoose from "mongoose";

export const conntectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("mongo db connection :", conn.connection.host)
    }catch(error){
        console.log("Error connecting to mongo db :", error.messaage)
        process.exit(1)
    }       
} 