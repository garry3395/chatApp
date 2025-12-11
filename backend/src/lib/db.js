import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
export const connectDB=async()=>{
  try{
  const conn= await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDb conncted: ${conn.connection.host}`)
  }
  catch(error){

  console.error("error connecting  mongodb",error);
  process.exit(1);//exit with failure
  }
}
