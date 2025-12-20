import Message from "../models/Message.js";
import { User } from "../models/User.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";
import { v2 as cloudinary } from "cloudinary";

export const  getAllContacts=async(req,res,next)=>{
  try {
    const loggedInUserId=req.user._id;
    const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password")
     res.status(200).json(filteredUsers);
     

  

  } catch (error) {
    console.error("error in  getAll contacts",error)
    res.status(500).json({message:"server error "})
  }
}
export const  getMessagesByUserId=async(req,res)=>{
  try {
    const myId=req.user._id;
  const {id:userToChatId}=req.params
  const messages = await Message.find({
  $or: [
    { senderId: myId, receiverId: userToChatId },
    { senderId: userToChatId, receiverId: myId }
  ]
});
      res.status(200).json(messages)
  } catch (error) {
    console.log(" eror in getMessages ",error)
    res.status(500).json({message:"internal server error "})
    
  }

}
export const sendMessage=async(req,res)=>{
 try {
   const {text,image}=req.body;
  const {id:receiverId}=req.params;
  const senderId=req.user._id;
  if (!text && !image) {
  return res.status(400).json({ message: "Text or image is required." });
}

if (senderId.equals(receiverId)) {
  return res.status(400).json({ message: "Cannot send messages to yourself." });
}

const receiverExists = await User.exists({ _id: receiverId });
if (!receiverExists) {
  return res.status(404).json({ message: "Receiver not found." });
}

   let imgUrl;
    if(image){  
      const uploadResponse= await cloudinary.uploader.upload(image)
      imgUrl=uploadResponse.secure_url;
    }
    const newMessage = new Message({
  senderId,
  receiverId,
  text,
  image: imgUrl
});

await newMessage.save();
// Emit the new message to the receiver if they are online
   const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getChatPartners=async(req,res)=>{
  try {
    const loggedInUserId=req.user._id;
    //find all the users which are either reciever or sender 
    const messages = await Message.find({
  $or: [
    { senderId: loggedInUserId}, {receiverId: loggedInUserId}]
});
const chatPartnerIds=  [...new Set(messages.map(msg=>msg.senderId.toString()===loggedInUserId.toString()?msg.receiverId.toString():msg.senderId.toString()))]


const chatPartners=await User.find({_id:{$in:chatPartnerIds}}).select("-password")
res.status(200).json(chatPartners)
  } catch (error) {
    console.log("error in this route",error)
    res.status(500).json({message:"internal server error"})
    
  }
}