import { useState, useEffect, useRef } from 'react';

interface MotionDetectionResult {
  motionDetected: boolean;
  motionLevel: number;
}

export const useMotionDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  threshold: number = 30
): MotionDetectionResult => {
  const [motionDetected, setMotionDetected] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousFrameRef = useRef<ImageData | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const detectMotion = () => {
      if (!ctx || !videoRef.current || videoRef.current.readyState !== 4) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (previousFrameRef.current) {
        let diffSum = 0;
        const pixels = currentFrame.data.length / 4;

        for (let i = 0; i < currentFrame.data.length; i += 4) {
          const diff = Math.abs(currentFrame.data[i] - previousFrameRef.current.data[i]);
          diffSum += diff;
        }

        const avgDiff = diffSum / pixels;
        setMotionLevel(Math.min(100, avgDiff));
        setMotionDetected(avgDiff > threshold);
      }

      previousFrameRef.current = currentFrame;
    };

    const interval = setInterval(detectMotion, 200);

    return () => clearInterval(interval);
  }, [videoRef, threshold]);

  return { motionDetected, motionLevel };
};
