import { resendClient, sender } from '../lib/resend.js';
import { createWelcomeEmailTemplate } from './emailTemplates.js';

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: process.env.ADMIN_EMAIL, 
    subject: "New User Signup Alert 🚨",
    html: createWelcomeEmailTemplate(name, email, clientURL)
  });

  if (error) {
    console.log("Error in sending signup alert", error);
    throw new Error("Failed to send signup alert email");
  }
  console.log("Signup alert email sent successfully", data);
};
