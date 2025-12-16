import mongoose from 'mongoose'
import { ENV } from './env.js';
const {MONGODB_URI}=ENV;
if(!MONGODB_URI){
  throw new Error("MONGODB_URI is not defined in environment variables");
}
export const connectDB=async()=>{
  try{
  const conn= await mongoose.connect(ENV.MONGODB_URI);
  console.log(`MongoDb conncted: ${conn.connection.host}`)
  }
  catch(error){

  console.error("error connecting  mongodb",error);
  process.exit(1);//exit with failure
  }
}
