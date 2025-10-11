import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AlertPanelProps {
  isAlert: boolean;
  alertType: string;
}

export const AlertPanel = ({ isAlert, alertType }: AlertPanelProps) => {
  return (
    <Card className={`p-6 border-2 transition-all duration-300 ${
      isAlert 
        ? 'bg-gradient-alert border-destructive shadow-glow-alert' 
        : 'bg-gradient-safe border-success shadow-glow-safe'
    }`}>
      <div className="flex flex-col items-center justify-center gap-4">
        {isAlert ? (
          <>
            <AlertTriangle className="w-16 h-16 text-destructive animate-pulse" />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-destructive mb-2">⚠️ ALERT!</h2>
              <p className="text-lg text-foreground">{alertType}</p>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-16 h-16 text-success" />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-success mb-2">✓ SAFE</h2>
              <p className="text-lg text-muted-foreground">All systems monitoring normally</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
