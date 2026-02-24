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

  const [stream, setStream] = useState(null);
  const streamRef = useRef(null); // Fix: Use ref to access latest stream inside socket events
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callTimeoutRef = useRef(null);
  const iceQueueRef = useRef([]); // Fix: Queue ICE candidates until connection is ready

  const getMedia = useCallback(async (facingMode = "user") => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });

      setStream(mediaStream);
      streamRef.current = mediaStream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      
      return mediaStream; // Fix: Return stream so it can be used immediately
    } catch (err) {
      console.error(err);
      alert("Camera/Mic permission denied");
      return null;
    }
  }, []);

  // Initialize camera on load
  useEffect(() => {
    getMedia(isFrontCamera ? "user" : "environment");
    
    // Cleanup camera when leaving the page
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isFrontCamera, getMedia]);

  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      console.log("Generated ICE candidate");
      if (event.candidate && selectedUser) {
        socket?.emit("iceCandidate", {
          to: selectedUser._id,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("Remote stream received:", event.streams);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    if (!selectedUser || !socket) return;
    
    // Ensure we have media before calling
    let currentStream = streamRef.current || await getMedia();
    if (!currentStream) return; 

    if (callStatus !== "idle") return;

    setCallStatus("calling");

    const pc = createPeerConnection();
    
    // Add tracks BEFORE creating the offer
    currentStream.getTracks().forEach((track) => pc.addTrack(track, currentStream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("callUser", {
      to: selectedUser._id,
      offer,
    });

    callTimeoutRef.current = setTimeout(() => {
      if (callStatus !== "connected") {
        alert("Call Failed / No Answer");
        cleanupCall();
        navigate("/");
      }
    }, 30000);
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = async ({ from, offer }) => {
      setCallStatus("connecting");
      
      let currentStream = streamRef.current || await getMedia();
      const pc = createPeerConnection();
      
      // Fix: Add tracks using the immediately available local variable
      if (currentStream) {
        currentStream.getTracks().forEach((track) => pc.addTrack(track, currentStream));
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Process any queued ICE candidates that arrived early
      while (iceQueueRef.current.length > 0) {
        const candidate = iceQueueRef.current.shift();
        await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answerCall", { to: from, answer });
    };

    const handleCallAccepted = async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus("connected");
        clearTimeout(callTimeoutRef.current);
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      console.log("Received ICE candidate");
      const pc = peerConnectionRef.current;
      
      try {
        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          // Fix: If remote description isn't ready, save candidate for later
          iceQueueRef.current.push(candidate);
        }
      } catch (err) {
        console.log("ICE error", err);
      }
    };

    const handleCallEnded = () => {
      cleanupCall();
      navigate("/");
    };

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callEnded", handleCallEnded);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("callEnded", handleCallEnded);
    };
  }, [socket]); // Fix: Removed `stream` from dependency array so listeners aren't dropped

  const cleanupCall = () => {
    clearTimeout(callTimeoutRef.current);

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    iceQueueRef.current = []; // Empty the queue

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setCallStatus("idle");
    setStream(null);
    streamRef.current = null;
  };

  const endCall = () => {
    socket?.emit("endCall", { to: selectedUser?._id });
    cleanupCall();
    navigate("/");
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // Toggle opposite of current state
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff; // Toggle opposite of current state
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black text-white">
      {callStatus === "connected" ? (
        <video
          ref={isSwapped ? localVideoRef : remoteVideoRef}
          autoPlay
          playsInline
          muted={isSwapped}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {callStatus === "calling" && "📞 Ringing..."}
          {callStatus === "connecting" && "🔄 Connecting..."}
          {callStatus === "idle" && "Press Call"}
        </div>
      )}

      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSwapped(!isSwapped)}
        className="absolute top-4 right-4 w-32 h-48 rounded-2xl overflow-hidden border z-10 cursor-pointer bg-gray-900"
      >
        <video
          ref={isSwapped ? remoteVideoRef : localVideoRef}
          autoPlay
          playsInline
          muted={!isSwapped}
          className="w-full h-full object-cover scale-x-[-1]"
        />
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full z-10">
        <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-transparent'}`}>
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-transparent'}`}>
          {isVideoOff ? <VideoOff /> : <Video />}
        </button>

        {callStatus === "idle" ? (
          <button onClick={startCall} className="bg-green-600 p-3 rounded-full">
            Call
          </button>
        ) : (
          <button onClick={endCall} className="bg-red-600 p-3 rounded-full">
            <PhoneOff />
          </button>
        )}

        <button onClick={() => setIsFrontCamera(!isFrontCamera)}>
          <RefreshCw />
        </button>
      </div>
    </div>
  );
}


/*  import React, { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

export default function VideoCallPage() {
  const navigate = useNavigate();
  const { selectedUser } = useChatStore();
  const socket = useAuthStore((state) => state.socket);

  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);
  const [callStatus, setCallStatus] = useState("idle");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callTimeoutRef = useRef(null);

  const getMedia = useCallback(async (facingMode = "user") => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true,
      });

      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("Camera/Mic permission denied");
    }
  }, []);

  useEffect(() => {
    getMedia(isFrontCamera ? "user" : "environment");
  }, [isFrontCamera, getMedia]);

  
  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }
        ,
      { urls: "turn:your.turn.server:3478", username: "user", credential: "pass" }
      ],
    });

    pc.onicecandidate = (event) => {
      console.log("Generated ICE candidate:", event.candidate)
      if (event.candidate && selectedUser) {
        socket?.emit("iceCandidate", {
          to: selectedUser._id,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {

      if (remoteVideoRef.current) {
        console.log("Remote stream received:", event.streams);
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

 
  const startCall = async () => {
    if (!selectedUser || !stream || !socket) return;
    if (callStatus !== "idle") return;

    setCallStatus("calling");

    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("callUser", {
      to: selectedUser._id,
      offer,
    });

    callTimeoutRef.current = setTimeout(() => {
      if (callStatus !== "connected") {
        alert("Call Failed");
        cleanupCall();
        navigate("/");
      }
    }, 30000);
  };


  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = async ({ from, offer }) => {
      if (!stream) await getMedia();

      setCallStatus("connecting");

      const pc = createPeerConnection();
      stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answerCall", { to: from, answer });
    };

    const handleCallAccepted = async ({ answer }) => {
      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      setCallStatus("connected");
      clearTimeout(callTimeoutRef.current);
    };

    const handleIceCandidate = async ({ candidate }) => {
      console.log("Received ICE candidate:", candidate);
      try {
        await peerConnectionRef.current?.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.log("ICE error", err);
      }
    };

    const handleCallEnded = () => {
      cleanupCall();
      navigate("/");
    };

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAccepted", handleCallAccepted);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callEnded", handleCallEnded);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAccepted", handleCallAccepted);
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("callEnded", handleCallEnded);
    };
  }, [socket, stream]);


  const cleanupCall = () => {
    clearTimeout(callTimeoutRef.current);

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    stream?.getTracks().forEach((track) => track.stop());

    setCallStatus("idle");
    setStream(null);
  };

  const endCall = () => {
    socket?.emit("endCall", { to: selectedUser?._id });
    cleanupCall();
    navigate("/");
  };

  
  const toggleMute = () => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = isVideoOff;
    });
    setIsVideoOff(!isVideoOff);
  };

  return (
    <div className="relative h-screen w-full bg-black text-white">
      {callStatus === "connected" ? (
        <video
          ref={isSwapped ? localVideoRef : remoteVideoRef}
          autoPlay
          playsInline
          muted={isSwapped}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {callStatus === "calling" && "📞 Ringing..."}
          {callStatus === "connecting" && "🔄 Connecting..."}
          {callStatus === "idle" && "Press Call"}
        </div>
      )}

      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSwapped(!isSwapped)}
        className="absolute top-4 right-4 w-32 h-48 rounded-2xl overflow-hidden border"
      >
        <video
          ref={isSwapped ? remoteVideoRef : localVideoRef}
          autoPlay
          playsInline
          muted={!isSwapped}
          className="w-full h-full object-cover scale-x-[-1]"
        />
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full">
        <button onClick={toggleMute}>
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        <button onClick={toggleVideo}>
          {isVideoOff ? <VideoOff /> : <Video />}
        </button>

        <button onClick={startCall} className="bg-green-600 p-3 rounded-full">
          Call
        </button>

        <button onClick={endCall} className="bg-red-600 p-3 rounded-full">
          <PhoneOff />
        </button>

        <button onClick={() => setIsFrontCamera(!isFrontCamera)}>
          <RefreshCw />
        </button>
      </div>
    </div>
  );
}  */