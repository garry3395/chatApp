import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../lib/arcjet.js";
export  const arcjetProtection=async(req,res,next)=>{
  try {
    const decision=  await aj.protect(req);
    if(decision.isDenied()){
       if(decision.reason.isRateLimit()){
        return res.status(429).json({message:"rate limit exceeded.please try again later"})
       }
    else if(decision.reason.isBot()){
      return res.status(403).json({message:"bot access denied"})



    }else{
     return res.status(403).json({message:"access denied by security policy"})
    }
  }
  //for spoofed bots
  if (decision.results.some(isSpoofedBot)) {
    return res.status(403).json({message:"malicious bot activated",
                                   error:"spoofed bot detected"})
  }
  next()
  } catch (error) {
    console.error("error in arcjet :",error);
    next()
    
  }
}