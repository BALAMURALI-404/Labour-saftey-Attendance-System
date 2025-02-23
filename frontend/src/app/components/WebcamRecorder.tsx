"use client";
import { useRef, useState, useEffect } from "react";

const WebcamRecorder = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined); // Change null to undefined
  
  // State for performance metrics
  const [modelInferenceTime, setModelInferenceTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [overheadTime, setOverheadTime] = useState<number>(0);
  const [modelFps, setModelFps] = useState<number>(0);
  const [totalFps, setTotalFps] = useState<number>(0);
  const [overheadFps, setOverheadFps] = useState<number>(0);

  const startWebcam = async () => {
    console.log("Starting webcam...");
    try {
      const constraints = deviceId ? { video: { deviceId } } : { video: true };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log(newStream);  // Log the stream to ensure it's valid
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setStream(newStream);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopWebcam = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const liveDetection = () => {
    console.log("Live detection started");
    // Replace this with your model's live detection logic
    // The logic here can update `modelInferenceTime`, `totalTime`, etc.
    setModelInferenceTime(48);  // Example: update based on inference time
    setTotalTime(55);  // Example: update based on total processing time
    setOverheadTime(7); // Example: update overhead time
    setModelFps(20.83); // Example: update model FPS
    setTotalFps(18.18); // Example: update total FPS
    setOverheadFps(-2.65); // Example: update overhead FPS
  };

  const changeCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const currentDeviceIndex = videoDevices.findIndex(device => device.deviceId === deviceId);

      // Switch to the next available camera
      const nextDevice = videoDevices[(currentDeviceIndex + 1) % videoDevices.length];
      setDeviceId(nextDevice.deviceId);

      // Restart webcam with new device
      stopWebcam();
      startWebcam();
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  // Periodically update FPS and other metrics while webcam is running
  useEffect(() => {
    if (stream) {
      const interval = setInterval(() => {
        // Example: Update these values with actual data from your model
        // For now, we're using static values
        setModelInferenceTime(48);
        setTotalTime(55);
        setOverheadTime(7);
        setModelFps(20.83);
        setTotalFps(18.18);
        setOverheadFps(-2.65);
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-[640px] h-[480px] rounded-lg border-2 border-gray-300 shadow-lg"
        style={{ display: "block" }} // Ensure video is displayed
      />
      <div className="mt-4 flex gap-4">
        <button
          onClick={startWebcam}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Start Webcam
        </button>
        <button
          onClick={stopWebcam}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Stop Webcam
        </button>
        <button
          onClick={liveDetection}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Live Detection
        </button>
        <button
          onClick={changeCamera}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Change Camera
        </button>
      </div>

      {/* Display the metrics */}
      <div className="mt-6 text-center">
        <div>Model Inference Time: {modelInferenceTime}ms</div>
        <div>Total Time: {totalTime}ms</div>
        <div>Overhead Time: +{overheadTime}ms</div>
        <div>Model FPS: {modelFps.toFixed(2)}fps</div>
        <div>Total FPS: {totalFps.toFixed(2)}fps</div>
        <div>Overhead FPS: {overheadFps.toFixed(2)}fps</div>
      </div>
    </div>
  );
};

export default WebcamRecorder;
