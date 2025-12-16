import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
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
    const savedUser=await newUser.save();


    generateToken(savedUser._id,res) //generateToken for jwt tokens

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


    try{ 
      await sendWelcomeEmail(savedUser.email,savedUser.fullname,ENV.CLIENT_URL);

      
    }catch(error){
      console.error("failed to send welcome email:",error)

    }


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

export const login=async(req,res)=>{
  const {email,password}=req.body ;
  if (!email||!password){
    return res.status(200).json({message:"email and password are required"})
    
  }
  try{
   const user= await User.findOne({email})
   if(!user) return res.status(400).json({message:"invalid crendentials check your inputs"})
    const isPasswordCorrect= await bcrypt.compare(password,user.password)
  if (!isPasswordCorrect){
    return res.status(400).json({message:"invalid crendentials check your inputs"})
  }
  generateToken(user._id,res)
    res.status(200).json({
      message:"User login succesfully",
      user:{
        _id: user._id,
        fullname:user.fullname,
        email:user.email,
        profilePic:user.profilePic
      }
    
    })
    
  }
  catch(err){
   console.error("error in login page is:",err)
   res.status(500).json({message:"internal server error"})
  }
}
export const logout=async(_,res)=>{
  res.cookie("jwt","",{maxAge:0})


  res.status(200).json({message:"Successfully loggedOut"})

}

export const updateProfile= async(req,res)=>{
 try {
   const {profilePic}=req.body;
  if(!profilePic) return res.status(400).json({message:"Profile pic is required"})
    const userId=req.user._id;
  const updateResponse= await cloudinary.uploader.upload(profilePic)
   const updatedUser= await User.findByIdAndUpdate(userId,{
    profilePic:updateResponse.secure_url
   },{new:true})
   res.status(200).json(updatedUser)


 } catch (error) {
  console.log("error in updated profile:",error)
  return res.status(500).json({message:"Internal server Error"})
 }


}