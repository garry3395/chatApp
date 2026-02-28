import React, { useEffect, useRef, useState, useCallback } from "react";
import { Phone, PhoneOff, Mic, MicOff, Volume2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function VoiceCallPage() {
  const navigate = useNavigate();
  const { selectedUser } = useChatStore();
  const socket = useAuthStore((state) => state.socket);

  const remoteAudioRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const iceQueueRef = useRef([]);

  const [callStatus, setCallStatus] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);

  // --- 1. CLEANUP FUNCTION ---
  const cleanup = useCallback(() => {
    console.log("Cleaning up call resources...");
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    iceQueueRef.current = [];
    setCallStatus("idle");
    setIsMuted(false);
  }, []);

  // --- 2. GET MEDIA ---
  const getMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      toast.error("Microphone permission denied");
      return null;
    }
  }, []);

  // --- 3. CREATE PEER ---
  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pc.onicecandidate = (e) => {
      if (e.candidate && selectedUser) {
        socket.emit("iceCandidate", { to: selectedUser._id, candidate: e.candidate });
      }
    };
    pc.ontrack = (e) => {
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = e.streams[0];
    };
    peerRef.current = pc;
    return pc;
  }, [selectedUser, socket]);

  // --- 4. START CALL ---
  const startCall = async () => {
    if (!selectedUser || !socket) return;
    setCallStatus("calling");
    const stream = await getMedia();
    if (!stream) return;
    const pc = createPeer();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("callUser", { to: selectedUser._id, offer, callType: "voice" });
  };

  // --- 5. UNIFIED SOCKET EFFECT ---
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = async ({ from, offer, callType }) => {
      if (callType !== "voice") return;
      setCallStatus("connecting");
      const stream = await getMedia();
      const pc = createPeer();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      for (const candidate of iceQueueRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      iceQueueRef.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answerCall", { to: from, answer, callType: "voice" });
      setCallStatus("connected");
    };

    const handleCallAccepted = async ({ answer }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus("connected");
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      const pc = peerRef.current;
      if (pc && pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        iceQueueRef.current.push(candidate);
      }
    };

    const onCallEnded = () => {
      cleanup();
      navigate("/");
    };

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callEnded", onCallEnded);

    return () => {
      cleanup(); // Jab page se bahar jaye tab sab clear karein
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("callEnded", onCallEnded);
    };
  }, [socket, getMedia, createPeer, navigate, cleanup]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const enabled = localStreamRef.current.getAudioTracks()[0].enabled;
      localStreamRef.current.getAudioTracks()[0].enabled = !enabled;
      setIsMuted(!enabled === false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0b141a] flex flex-col items-center justify-between py-20 px-6 overflow-hidden">
      <audio ref={remoteAudioRef} autoPlay />
      
      {/* Decorative background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[20%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[20%] bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="flex flex-col items-center z-10">
        <div className="relative">
          {callStatus === "calling" && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] , opacity: [0.5, 0, 0.5]}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-emerald-500 rounded-full"
            />
          )}
          
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-emerald-500/30 p-1 relative z-10 overflow-hidden bg-slate-800">
            {selectedUser?.profilePic ? (
              <img src={selectedUser.profilePic} alt="profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={60} className="text-slate-400" />
              </div>
            )}
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-bold text-white tracking-tight">{selectedUser?.fullname || "Unknown User"}</h2>
        <p className="mt-2 text-emerald-400 font-medium tracking-widest text-sm flex items-center gap-2 uppercase">
          {callStatus === "idle" && "Ready to call"}
          {callStatus === "calling" && "Ringing..."}
          {callStatus === "connecting" && "Connecting..."}
          {callStatus === "connected" && <span className="text-blue-400">In Call</span>}
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-10 z-10">
        <div className="flex items-center justify-center gap-8 w-full">
          <button onClick={toggleMute} className={`flex flex-col items-center gap-2 transition-all ${callStatus === "idle" ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
            <div className={`p-5 rounded-full ${isMuted ? 'bg-white text-black' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </div>
            <span className="text-xs text-gray-400 font-medium">Mute</span>
          </button>
          <button className="flex flex-col items-center gap-2 opacity-50">
            <div className="p-5 rounded-full bg-slate-800 text-white"><Volume2 size={24} /></div>
            <span className="text-xs text-gray-400 font-medium">Speaker</span>
          </button>
        </div>

        <div className="flex items-center justify-center">
          {callStatus === "idle" ? (
            <button onClick={startCall} className="bg-emerald-500 hover:bg-emerald-600 p-8 rounded-full shadow-2xl transition-all active:scale-90">
              <Phone size={36} color="white" fill="white" />
            </button>
          ) : (
            <button 
              onClick={() => { socket.emit("endCall", { to: selectedUser?._id }); cleanup(); navigate("/"); }}
              className="bg-red-500 hover:bg-red-600 p-8 rounded-full shadow-2xl transition-all active:scale-90"
            >
              <PhoneOff size={36} color="white" fill="white" className="rotate-[135deg]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}