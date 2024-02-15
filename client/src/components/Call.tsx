import React, { useState, useEffect, useRef } from "react";
import { Peer, MediaConnection } from "peerjs";

interface CallProps {
  userId: string;
}

const Call: React.FC<CallProps> = ({ userId }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [call, setCall] = useState<any | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // const newPeer = new (Peer as any)(userId);
    const newPeer = new (Peer as any)(userId, {
      host: "0.peerjs.com",
      port: 9000,
      path: "/peerjs/myapp",
      secure: false,
      debug: 3,
    });
    // const peer = new Peer({
    //     config: {
    //       'iceServers': [
    //         { url: 'stun:stun.l.google.com:19302' },
    //         { url: 'turn:homeo@turn.bistri.com:80', credential: 'homeo' }
    //          or
    //          { url: 'stun:stun1.l.google.com:19302' },
    //          { url: 'turn:numb.viagenie.ca',       credential: 'muazkh', username: 'webrtc@live.com' }
    //       ],
    //       'sdpSemantics': 'unified-plan'
    //     },
    //     debug: 3
    //   });

    newPeer.on("open", function (id: number) {
      console.log("My peer ID is: " + id);
    });

    newPeer.on("error", function (err: Error) {
      console.log(err);
    });

    setPeer(newPeer);

    newPeer.on("call", (call: MediaConnection) => {
      // Provide explicit type
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
          // audio: {
          //     echoCancellation: true,
          //     noiseSuppression: true,
          //     autoGainControl: true,
          //     channelCount: 2,
          //     sampleSize: 16,
          //     sampleRate: 44100,
          //     volume: 1.0
          //   }
        })
        .then((stream) => {
          call.answer(stream);
          setCall(call);
          setStream(stream);
          call.on("stream", (remoteStream: MediaStream) => {
            // Provide explicit type
            if (videoRef.current) {
              videoRef.current.srcObject = remoteStream;
            }
          });
        });
    });

    return () => {
      newPeer.destroy();
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
          // audio: {
          //     echoCancellation: true,
          //     noiseSuppression: true,
          //     autoGainControl: true,
          //     channelCount: 2,
          //     sampleSize: 16,
          //     sampleRate: 44100,
          //     volume: 1.0
          //   }
        })
        .then((stream) => {
          setStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          const call = peer.call(userId, stream);
          setCall(call);
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

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="p-4 overflow-auto min-h-48">
        <video
          ref={localVideoRef}
          autoPlay
          className="w-full h-64 mt-2"
        ></video>
        <audio ref={audioRef} autoPlay className="w-full h-64 mt-2"></audio>
        {/* <video ref={videoRef} autoPlay className="w-full h-64 mt-2"></video> */}
      </div>
      <div className="p-4 bg-gray-200">
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
      </div>
    </div>
  );
};

export default Call;
