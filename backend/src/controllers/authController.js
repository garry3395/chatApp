import { generateToken } from "../lib/utils.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs"
export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
//check if user already exists
   const user=await User.findOne({email})
   if (user){
    return res.status(400).json({
      message :"email already exists"
    })
   }
   //let hash the password 
   const salt =await bcrypt.genSalt(10);
   const hashedPassword=await bcrypt.hash(password,salt)
   const newUser=new User({
    fullname,
    email,
    password:hashedPassword
   })
  if(newUser){
    generateToken(newUser._id,res) //generateToken for jwt tokens

   await newUser.save()
     res.status(201).json({
      message:"User registered succesfully",
      user:{
        _id: newUser._id,
        fullname:newUser.fullname,
        email:newUser.email,
        profilePic:newUser.profilePic
      }
    })
  }
  else{
    return res.status(400).json({message:"signup not successful"
    })
  
  }
  } catch (err) {
    console.error("err in signup", err);
    res.status(500).json({ message: "Server error" });
  }
};
