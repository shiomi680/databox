import mongoose, { mongo } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true
    }
    const mongod = await MongoMemoryServer.create(
      {
        instance: {
          port: 27111,
          dbName: "data-box",

        }, spawn: {}
      }
    )
    const uri = "mongodb://localhost:27111/data-box" //process.env.MONGODB_URI
    // const uri = "mongodb://localhost:27017/data-box" //process.env.MONGODB_URI
    await mongoose.connect(uri)
    console.log("mongodb connected")
    return true
  } catch (error: any) {
    console.log(error)
  }
}