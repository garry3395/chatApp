import express from 'express'
import cookieParser from "cookie-parser"

import authRoutes from './routes/auth.js'
import messageRoutes from './routes/message.js'
import path from "path"
import { connectDB } from './lib/db.js'
import { ENV } from './lib/env.js'
const app=express();
const __dirname=path.resolve()

//user workspace 

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',authRoutes)

app.use('/api/messages',messageRoutes)
//now code for deployment 
if(ENV.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
  app.get("*",(req,res)=>{
    app.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
  })
}
 

 
const PORT=ENV.PORT||3000
app.listen(PORT,()=>{
  console.log(`Server is running on port http://localhost:${PORT}`)
  connectDB();
})