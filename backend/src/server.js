import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import messageRoutes from './routes/message.js'
import path from "path"
import { connectDB } from './lib/db.js'
const app=express();
const __dirname=path.resolve()
dotenv.config()

//user workspace 
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
//now code for deployment 
if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
  app.get("*",(req,res)=>{
    app.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
  })
}
 
 
const PORT=process.env.PORT||3000
app.listen(PORT,()=>{
  console.log(`Server is running on port http://localhost:${PORT}`)
  connectDB();
})