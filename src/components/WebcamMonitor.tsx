import { useWebcam } from '@/hooks/useWebcam';
import { useMotionDetection } from '@/hooks/useMotionDetection';
import { useLightDetection } from '@/hooks/useLightDetection';
import { Card } from '@/components/ui/card';
import { AlertCircle, Video } from 'lucide-react';

interface WebcamMonitorProps {
  onMotionDetected: (detected: boolean) => void;
  onLightChange: (changed: boolean) => void;
}

export const WebcamMonitor = ({ onMotionDetected, onLightChange }: WebcamMonitorProps) => {
  const { stream, error, videoRef } = useWebcam();
  const { motionDetected, motionLevel } = useMotionDetection(videoRef);
  const { lightLevel, suddenChange } = useLightDetection(videoRef);

  // Notify parent of detection events
  if (motionDetected) onMotionDetected(true);
  if (suddenChange) onLightChange(true);

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-3">
        <Video className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Camera Feed</h3>
      </div>
      
      {error ? (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      ) : (
        <>
          <div className="relative rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
            />
            {motionDetected && (
              <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                MOTION
              </div>
            )}
            {suddenChange && (
              <div className="absolute top-2 left-2 bg-warning text-warning-foreground px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                LIGHT CHANGE
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Motion Level</span>
                <span className="font-mono text-foreground">{motionLevel.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.min(100, motionLevel)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Light Intensity</span>
                <span className="font-mono text-foreground">{lightLevel.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-warning transition-all duration-300"
                  style={{ width: `${Math.min(100, lightLevel)}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
