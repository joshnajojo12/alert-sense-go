import { useState, useEffect } from 'react';

interface AudioDetectionResult {
  soundLevel: number;
  loudSoundDetected: boolean;
  error: string | null;
}

export const useAudioDetection = (threshold: number = 70): AudioDetectionResult => {
  const [soundLevel, setSoundLevel] = useState(0);
  const [loudSoundDetected, setLoudSoundDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let intervalId: number | null = null;
    let stream: MediaStream | null = null;

    const initAudio = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        
        microphone.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        const tempArray = new Uint8Array(bufferLength);
        dataArray = tempArray;
        
        const detectSound = () => {
          if (!analyser || !dataArray) return;
          
          const currentArray = new Uint8Array(dataArray.length);
          analyser.getByteFrequencyData(currentArray);
          
          let sum = 0;
          for (let i = 0; i < currentArray.length; i++) {
            sum += currentArray[i];
          }
          const average = sum / currentArray.length;
          const normalizedLevel = (average / 255) * 100;
          
          setSoundLevel(normalizedLevel);
          setLoudSoundDetected(normalizedLevel > threshold);
        };
        
        intervalId = window.setInterval(detectSound, 100);
      } catch (err) {
        setError('Failed to access microphone. Please grant microphone permissions.');
        console.error('Microphone error:', err);
      }
    };

    initAudio();

    return () => {
      if (intervalId !== null) window.clearInterval(intervalId);
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (audioContext) audioContext.close();
    };
  }, [threshold]);

  return { soundLevel, loudSoundDetected, error };
};
