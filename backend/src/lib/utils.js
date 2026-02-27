import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ENV } from './env.js';
dotenv.config();
 export const generateToken=(userId,res)=>{
  const token=jwt.sign({id:userId},ENV.JWT_SECRET,{
    expiresIn:'7d'
  })
  res.cookie('jwt',token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    sameSite:'lax',
    secure:ENV.NODE_ENV==='development'?false:true,

   

  })
 
  return token;
  
} 

