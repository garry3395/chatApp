import React, { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

export default function VideoCallPage() {
  const navigate = useNavigate();
  const { selectedUser } = useChatStore();
  const socket = useAuthStore((state) => state.socket);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const iceQueueRef = useRef([]);

  const [callStatus, setCallStatus] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFront, setIsFront] = useState(true);

  const getMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isFront ? "user" : "environment" },
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      alert("Camera / Mic permission denied");
      return null;
    }
  }, [isFront]);

  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate && selectedUser) {
        socket.emit("iceCandidate", {
          to: selectedUser._id,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    peerRef.current = pc;
    return pc;
  }, [selectedUser, socket]);

  const startCall = async () => {
    if (!selectedUser || !socket) return;
    setCallStatus("calling");
    const stream = await getMedia();
    if (!stream) return;

    const pc = createPeer();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // FIX: callType bhejni zaroori hai
    socket.emit("callUser", {
      to: selectedUser._id,
      offer,
      callType: "video",
    });
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = async ({ from, offer, callType }) => {
      // FIX: Sirf video calls accept karo yahan
      if (callType !== "video") return;

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

      socket.emit("answerCall", { to: from, answer, callType: "video" });
      setCallStatus("connected");
    };

    const handleCallAccepted = async ({ answer, callType }) => {
      if (callType !== "video") return;
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

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callEnded", () => {
      cleanup();
      navigate("/");
    });

    return () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("iceCandidate", handleIceCandidate);
    };
  }, [socket, getMedia, createPeer, navigate]);

  const cleanup = () => {
    if (peerRef.current) peerRef.current.close();
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach((t) => t.stop());
    setCallStatus("idle");
  };

  return (
    <div className="relative h-screen w-full bg-black text-white">
      <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      
      {callStatus !== "connected" && (
        <div className="absolute inset-0 flex items-center justify-center text-2xl bg-black/40">
          {callStatus === "calling" && "📞 Ringing..."}
          {callStatus === "connecting" && "🔄 Connecting..."}
          {callStatus === "idle" && "Press Call"}
        </div>
      )}

      <div className="absolute top-4 right-4 w-32 h-48 rounded-2xl overflow-hidden border z-10 bg-gray-900">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full z-10">
        <button onClick={() => setIsMuted(!isMuted)}>{isMuted ? <MicOff /> : <Mic />}</button>
        {callStatus === "idle" ? (
          <button onClick={startCall} className="bg-green-600 px-4 py-2 rounded-full">Call</button>
        ) : (
          <button onClick={() => { socket.emit("endCall", { to: selectedUser?._id }); cleanup(); navigate("/"); }} className="bg-red-600 p-3 rounded-full">
            <PhoneOff />
          </button>
        )}
      </div>
    </div>
  );
}