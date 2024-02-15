import React, { useState, useEffect, useRef } from "react";
import { Peer } from "peerjs";
const Call = ({ userId }) => {
    const [peer, setPeer] = useState(null);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const localVideoRef = useRef(null);
    const [call, setCall] = useState(null);
    const [stream, setStream] = useState(null);
    useEffect(() => {
        // const newPeer = new (Peer as any)(userId);
        const newPeer = new Peer(userId, {
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
        newPeer.on("open", function (id) {
            console.log("My peer ID is: " + id);
        });
        newPeer.on("error", function (err) {
            console.log(err);
        });
        setPeer(newPeer);
        newPeer.on("call", (call) => {
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
                call.on("stream", (remoteStream) => {
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
                call.on("stream", (remoteStream) => {
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
                call.on("stream", (remoteStream) => {
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
    return (React.createElement("div", { className: "flex flex-col h-full bg-gray-100" },
        React.createElement("div", { className: "p-4 overflow-auto min-h-48" },
            React.createElement("video", { ref: localVideoRef, autoPlay: true, className: "w-full h-64 mt-2" }),
            React.createElement("audio", { ref: audioRef, autoPlay: true, className: "w-full h-64 mt-2" })),
        React.createElement("div", { className: "p-4 bg-gray-200" },
            React.createElement("button", { onClick: startVoiceCall, className: "w-full p-2 mt-2 text-white bg-green-500 rounded-lg" }, "Start Voice Call"),
            React.createElement("button", { onClick: startVideoCall, className: "w-full p-2 mt-2 text-white bg-green-500 rounded-lg" }, "Start Video Call"),
            React.createElement("button", { onClick: endCall, className: "w-full p-2 mt-2 text-white bg-red-500 rounded-lg" }, "End Call"),
            React.createElement("button", { onClick: toggleMute, className: "w-full p-2 mt-2 text-white bg-yellow-500 rounded-lg" }, "Mute Call"))));
};
export default Call;
//# sourceMappingURL=Call.js.map