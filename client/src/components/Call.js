import React, { useState, useEffect, useRef } from "react";
import { Peer } from "peerjs";
const Call = ({ userId, userTag, onLike }) => {
    const [peer, setPeer] = useState(null);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const localVideoRef = useRef(null);
    const [call, setCall] = useState(null);
    const [stream, setStream] = useState(null);
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [isCallActive, setIsCallActive] = useState(false); // Track if the call is active
    const countdownRef = useRef(null); // Ref to store the countdown interval
    const [nextParticipant, setNextParticipant] = useState(null); // Store next participant id
    // Mock user data for tags, replace this with real data
    const userTagMap = {
        user123: "technical",
        user456: "business",
        user789: "technical",
        user654: "business",
    };
    useEffect(() => {
        const newPeer = new Peer(userId, {
            host: "0.peerjs.com",
            port: 9000,
            path: "/peerjs/myapp",
            secure: false,
            debug: 3,
        });
        newPeer.on("open", function (id) {
            console.log("My peer ID is: " + id);
        });
        newPeer.on("error", function (err) {
            console.error("PeerJS Error:", err);
        });
        setPeer(newPeer);
        newPeer.on("call", (call) => {
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
                            clearInterval(countdownRef.current);
                            endCall(); // End the call when the time is up
                            return 0; // Timer finished
                        }
                        return prevTime - 1; // Decrement the timer
                    });
                }, 1000); // Update every second
                call.on("stream", (remoteStream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = remoteStream;
                    }
                });
            });
        });
        return () => {
            newPeer.destroy();
            clearInterval(countdownRef.current); // Clear the countdown interval on unmount
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
                            clearInterval(countdownRef.current);
                            endCall(); // End the call when the time is up
                            return 0; // Timer finished
                        }
                        return prevTime - 1; // Decrement the timer
                    });
                }, 1000); // Update every second
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
                            clearInterval(countdownRef.current);
                            endCall(); // End the call when the time is up
                            return 0; // Timer finished
                        }
                        return prevTime - 1; // Decrement the timer
                    });
                }, 1000); // Update every second
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
            setIsCallActive(false); // Call has ended
            clearInterval(countdownRef.current); // Clear the countdown interval
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
        const next = Object.keys(userTagMap).find((id) => userTagMap[id] !== userTag && id !== userId);
        if (next) {
            setNextParticipant(next);
            alert(`Next participant: ${next}`);
        }
        else {
            alert("No more participants with the opposite tag available.");
        }
    };
    const handleLike = () => {
        onLike({ userId, userTag });
    };
    return (React.createElement("div", { className: "flex flex-col h-full bg-gray-100" },
        React.createElement("div", { className: "p-4 overflow-auto min-h-48" },
            React.createElement("video", { ref: localVideoRef, autoPlay: true, className: "w-full h-64 mt-2" }),
            React.createElement("audio", { ref: audioRef, autoPlay: true, className: "w-full h-64 mt-2" }),
            React.createElement("div", { className: "text-center" },
                React.createElement("h2", null, `Time Remaining: ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`))),
        React.createElement("div", { className: "p-4 bg-gray-200" },
            React.createElement("button", { onClick: handleLike, className: "w-full p-2 mt-2 text-white bg-purple-500 rounded-lg" }, "Like"),
            React.createElement("button", { onClick: startVoiceCall, className: "w-full p-2 mt-2 text-white bg-green-500 rounded-lg" }, "Start Voice Call"),
            React.createElement("button", { onClick: startVideoCall, className: "w-full p-2 mt-2 text-white bg-green-500 rounded-lg" }, "Start Video Call"),
            React.createElement("button", { onClick: endCall, className: "w-full p-2 mt-2 text-white bg-red-500 rounded-lg" }, "End Call"),
            React.createElement("button", { onClick: toggleMute, className: "w-full p-2 mt-2 text-white bg-yellow-500 rounded-lg" }, "Mute Call"),
            React.createElement("button", { onClick: handleNextParticipant, className: "w-full p-2 mt-2 text-white bg-blue-500 rounded-lg" }, "Next Participant"))));
};
export default Call;
//# sourceMappingURL=Call.js.map