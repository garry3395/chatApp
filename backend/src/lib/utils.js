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
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: ENV.NODE_ENV === 'production' ? true : false,
    domain: ENV.NODE_ENV === 'production' ? '.onrender.com' : undefined
  })
 
  return token;
  
} 

