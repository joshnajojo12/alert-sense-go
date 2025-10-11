import { useAudioDetection } from '@/hooks/useAudioDetection';
import { Card } from '@/components/ui/card';
import { AlertCircle, Mic } from 'lucide-react';

interface AudioMonitorProps {
  onLoudSound: (detected: boolean) => void;
}

export const AudioMonitor = ({ onLoudSound }: AudioMonitorProps) => {
  const { soundLevel, loudSoundDetected, error } = useAudioDetection();

  if (loudSoundDetected) onLoudSound(true);

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-3">
        <Mic className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Audio Monitor</h3>
      </div>
      
      {error ? (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Sound Level</span>
            <span className="font-mono text-foreground">{soundLevel.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-150 ${
                loudSoundDetected ? 'bg-destructive' : 'bg-success'
              }`}
              style={{ width: `${Math.min(100, soundLevel)}%` }}
            />
          </div>
          {loudSoundDetected && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive rounded-lg animate-pulse">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-bold text-destructive">LOUD SOUND DETECTED!</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
