import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
  const { authUser,login} = useAuthStore();
       console.log("snapshot", { ...authUser });
         console.log("reference", authUser);
  
  return (
    <div>
      <h1> helo</h1>
    </div>
  )
}

export default LoginPage
