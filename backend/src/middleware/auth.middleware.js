import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ENV } from "../lib/env.js";
export const protectRoute=async(req,res,next)=>{
  try {
    const token=req.cookies.jwt;
    if(!token){
      return res.status(401).json({message:"Unauthorized no token provided"})
      }
     const decoded=jwt.verify(token,ENV.JWT_SECRET)
     if(!decoded){
      return res.status(401).json({message:"unauthorized : invalid token ,please login again"})
     }
    const user=await User.findById(decoded.id).select("-password")
    if(!user){
       return res.status(400).json({message:"user not found please login with correct details"})
    }
    req.user=user;

    next()
    
  } catch (error) {
    console.log("error in middleware:",error)
    res.status(500).json({message:"internal server error"})
  }
}
