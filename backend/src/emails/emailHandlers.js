import { resendClient,sender } from '../lib/resend.js';
import { createWelcomeEmailTemplate } from './emailTemplates.js';

export const sendWelcomeEmail=async(email,name,clientURL)=>{
  const {data,error}=await resendClient.emails.send({
    from:`${sender.name} <${sender.email}>`,
    to:email,
    subject:"Welcome to Chat App",
    html:createWelcomeEmailTemplate(name,clientURL)


//for welcome emial 

  })
  if(error){
    console.log("error in handling file",error);
    throw new Error("failed to render welcome email message")
  }
  console.log("welcome email message sending sucesfully",data)
}