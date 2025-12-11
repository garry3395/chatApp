import express from 'express'
import { signup } from '../controllers/authController.js';
const router=express.Router();

router.get('/signup',signup)

router.get('/logout',(req,res)=>{
  console.log("logout route hit")
   res.send("logout route hit")

})
 
router.get('/login',(req,res)=>{
  console.log("login route hit")  
    res.send("login route hit") 



})
export default router;