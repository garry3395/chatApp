import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import messageRoutes from './routes/message.js'

const app=express();
dotenv.config()
app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
 
 
const PORT=process.env.PORT||3000
app.listen(PORT,()=>{
  console.log(`Server is running on port http://localhost:${PORT}`)
})