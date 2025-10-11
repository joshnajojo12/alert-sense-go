import { useState, useEffect, useRef } from 'react';

interface LightDetectionResult {
  lightLevel: number;
  suddenChange: boolean;
}

export const useLightDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  threshold: number = 40
): LightDetectionResult => {
  const [lightLevel, setLightLevel] = useState(0);
  const [suddenChange, setSuddenChange] = useState(false);
  const previousLightRef = useRef<number>(0);

  useEffect(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    const detectLight = () => {
      if (!ctx || !videoRef.current || videoRef.current.readyState !== 4) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      let brightnessSum = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const brightness = (r + g + b) / 3;
        brightnessSum += brightness;
      }

      const avgBrightness = brightnessSum / (imageData.data.length / 4);
      const normalizedLight = (avgBrightness / 255) * 100;
      
      setLightLevel(normalizedLight);

      if (previousLightRef.current > 0) {
        const diff = Math.abs(normalizedLight - previousLightRef.current);
        setSuddenChange(diff > threshold);
      }

      previousLightRef.current = normalizedLight;
    };

    const interval = setInterval(detectLight, 300);

    return () => clearInterval(interval);
  }, [videoRef, threshold]);

  return { lightLevel, suddenChange };
};
