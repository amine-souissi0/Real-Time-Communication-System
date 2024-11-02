import React, { useState, useEffect, useRef } from "react";
import { Peer, MediaConnection } from "peerjs";

interface CallProps {
  userId: string;
  

  userTag: "technical" | "business"; // Explicitly typed as "technical" or "business"
  onLike: (likedUser: { userId: string; userTag: "technical" | "business" }) => void; // Add this prop

}

const Call: React.FC<CallProps> = ({ userId, userTag, onLike }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [call, setCall] = useState<any | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isCallActive, setIsCallActive] = useState(false); // Track if the call is active
  const countdownRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the countdown interval
  const [nextParticipant, setNextParticipant] = useState<string | null>(null); // Store next participant id

  // Mock user data for tags, replace this with real data
  const userTagMap: { [key: string]: "technical" | "business" } = {
    user123: "technical",
    user456: "business",
    user789: "technical",
    user654: "business",
  };

  useEffect(() => {
    const newPeer = new (Peer as any)(userId, {
      host: "0.peerjs.com",
      port: 9000,
      path: "/peerjs/myapp",
      secure: false,
      debug: 3,
    });

    newPeer.on("open", function (id: number) {
      console.log("My peer ID is: " + id);
    });

    newPeer.on("error", function (err: Error) {
      console.error("PeerJS Error:", err);
    });

    setPeer(newPeer);

    newPeer.on("call", (call: MediaConnection) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          call.answer(stream);
          setCall(call);
          setStream(stream);
          setIsCallActive(true); // Call is now active
          setTimer(300); // Reset timer to 5 minutes when a call starts

          // Start the countdown timer
          countdownRef.current = setInterval(() => {
            setTimer((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(countdownRef.current!);
                endCall(); // End the call when the time is up
                return 0; // Timer finished
              }
              return prevTime - 1; // Decrement the timer
            });
          }, 1000); // Update every second

          call.on("stream", (remoteStream: MediaStream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
            }
          });
        });
    });

    return () => {
      newPeer.destroy();
      clearInterval(countdownRef.current!); // Clear the countdown interval on unmount
    };
  }, [userId]);

  useEffect(() => {
    if (stream && audioRef.current) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);

  const startVoiceCall = () => {
    if (peer) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          setStream(stream);
          const call = peer.call(userId, stream);
          setCall(call);
          setIsCallActive(true); // Call is now active
          setTimer(300); // Reset timer to 5 minutes
          
          // Start the countdown timer
          countdownRef.current = setInterval(() => {
            setTimer((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(countdownRef.current!);
                endCall(); // End the call when the time is up
                return 0; // Timer finished
              }
              return prevTime - 1; // Decrement the timer
            });
          }, 1000); // Update every second

          call.on("stream", (remoteStream: MediaStream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
            }
          });
        });
    }
  };

  const startVideoCall = () => {
    if (peer) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          setStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          const call = peer.call(userId, stream);
          setCall(call);
          setIsCallActive(true); // Call is now active
          setTimer(300); // Reset timer to 5 minutes
          
          // Start the countdown timer
          countdownRef.current = setInterval(() => {
            setTimer((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(countdownRef.current!);
                endCall(); // End the call when the time is up
                return 0; // Timer finished
              }
              return prevTime - 1; // Decrement the timer
            });
          }, 1000); // Update every second

          call.on("stream", (remoteStream: MediaStream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
            }
          });
        });
    }
  };

  const endCall = () => {
    if (call) {
      call.close();
      setCall(null);
      setIsCallActive(false); // Call has ended
      clearInterval(countdownRef.current!); // Clear the countdown interval
      setTimer(300); // Reset timer to 5 minutes for next call
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleMute = () => {
    if (stream && stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    }
  };

  const handleNextParticipant = () => {
    endCall();
    setIsCallActive(false);

    // Find the next participant with opposite tag
    const next = Object.keys(userTagMap).find(
      (id) => userTagMap[id] !== userTag && id !== userId
    );

    if (next) {
      setNextParticipant(next);
      alert(`Next participant: ${next}`);
    } else {
      alert("No more participants with the opposite tag available.");
    }
  };
  const handleLike = () => {
    onLike({ userId, userTag });
  };
  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="p-4 overflow-auto min-h-48">
        <video
          ref={localVideoRef}
          autoPlay
          className="w-full h-64 mt-2"
        ></video>
        <audio ref={audioRef} autoPlay className="w-full h-64 mt-2"></audio>
        <div className="text-center">
          <h2>{`Time Remaining: ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}</h2>
        </div>
      </div>
      <div className="p-4 bg-gray-200">
      <button onClick={handleLike} className="w-full p-2 mt-2 text-white bg-purple-500 rounded-lg">
          Like
        </button>
        <button
          onClick={startVoiceCall}
          className="w-full p-2 mt-2 text-white bg-green-500 rounded-lg"
        >
          Start Voice Call
        </button>
        <button
          onClick={startVideoCall}
          className="w-full p-2 mt-2 text-white bg-green-500 rounded-lg"
        >
          Start Video Call
        </button>
        <button
          onClick={endCall}
          className="w-full p-2 mt-2 text-white bg-red-500 rounded-lg"
        >
          End Call
        </button>
        <button
          onClick={toggleMute}
          className="w-full p-2 mt-2 text-white bg-yellow-500 rounded-lg"
        >
          Mute Call
        </button>
        <button
          onClick={handleNextParticipant}
          className="w-full p-2 mt-2 text-white bg-blue-500 rounded-lg"
        >
          Next Participant
        </button>
      </div>
    </div>
  );
};

export default Call;
