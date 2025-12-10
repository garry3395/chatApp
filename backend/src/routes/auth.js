import express from 'express'
const router=express.Router();

router.get('/signup',(req,res)=>{
  console.log("signup route hit")
  res.send("signup route hit")

})

router.get('/logout',(req,res)=>{
  console.log("logout route hit")
   res.send("logout route hit")

})
 
router.get('/login',(req,res)=>{
  console.log("login route hit")  
    res.send("login route hit") 



})
export default router;