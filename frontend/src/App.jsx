import { Routes, Route, Navigate, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import VideoCallPage from "./pages/VedioCallPage";
import VoiceCallPage from "./pages/VoiceCallPage";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

const App = () => {
  const navigate = useNavigate();

  const {
    checkAuth,
    isCheckingAuth,
    authUser,
    incomingCall,
  } = useAuthStore();

  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!incomingCall) return;

    if (incomingCall.callType === "video") {
      navigate("/vedio-call");
    }

    if (incomingCall.callType === "voice") {
      navigate("/voice-call");
    }

   
    useAuthStore.setState({ incomingCall: null });

  }, [incomingCall, navigate]);

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">

    
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] pointer-events-none" />

      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Routes>
          <Route
            path="/"
            element={authUser ? <ChatPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />

          <Route
            path="/vedio-call"
            element={authUser ? <VideoCallPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/voice-call"
            element={authUser ? <VoiceCallPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
};

export default App;