import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Scenario } from "../components/Scenario";
import { ChatInterface } from "../components/ChatInterface";

export const InterviewScreen = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (cameraOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraOn]);

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="w-1/2 h-full">
          <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
            <Scenario />
          </Canvas>
        </div>
        <div className="w-1/2 h-full bg-gray-800 flex flex-col">
        <div className="flex-grow relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            className={`w-full h-full object-cover ${!cameraOn && "hidden"}`}
          />
          {!cameraOn && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <p className="text-white">User's webcam feed</p>
            </div>
          )}
        </div>
        <div className="flex justify-center p-4">
          <button
            onClick={toggleCamera}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white ml-4 ${
              cameraOn ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            Cam
          </button>
        </div>
        </div>
      </div>
      <ChatInterface />
    </>
  );
};
