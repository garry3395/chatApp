import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

const ChatPage = () => {
  const { authUser,login} = useAuthStore(); 
       console.log("snapshot", { ...authUser });
         console.log("reference", authUser);
  
  return (
   <>
   
   <h1>Chat Page</h1>
   </>
  )
}

export default ChatPage
