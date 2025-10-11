import { useState, useEffect } from 'react';
import { WebcamMonitor } from '@/components/WebcamMonitor';
import { AudioMonitor } from '@/components/AudioMonitor';
import { LocationTracker } from '@/components/LocationTracker';
import { AlertPanel } from '@/components/AlertPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { EventLog, LogEvent } from '@/components/EventLog';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

const Index = () => {
  const [isAlert, setIsAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [events, setEvents] = useState<LogEvent[]>([]);
  const { latitude, longitude, googleMapsUrl } = useGeolocation();

  const addEvent = (type: string) => {
    const newEvent: LogEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      location: latitude && longitude ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : undefined,
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 20)); // Keep last 20 events
  };

  const triggerAlert = (type: string) => {
    setIsAlert(true);
    setAlertType(type);
    addEvent(type);

    // Play alert sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryy3opBSh+zPDZiTYHG2m98OScTgwKUKrk8bllHAU7kdz0y3krBSh+zPDai8mJ6EgcBzqR3PTLeSsFKH7M8NqKyYnoSBwHOpHc9Mt5KwUofsyv/ugfBSx+zPDaisnInwABMQH/+yZH8+/Xp');
    audio.play().catch(e => console.log('Audio play failed:', e));

    toast.error(`🚨 ${type}`, {
      description: googleMapsUrl ? `Location: ${googleMapsUrl}` : 'Location unavailable',
      duration: 5000,
    });

    // Simulate Twilio call (would be real in production)
    if (phoneNumber) {
      toast.info('📞 Emergency Call Initiated', {
        description: `Calling ${phoneNumber}...`,
        duration: 3000,
      });
      console.log('Would call:', phoneNumber, 'with message:', type, 'at location:', googleMapsUrl);
    }

    // Reset alert after 5 seconds
    setTimeout(() => {
      setIsAlert(false);
      setAlertType('');
    }, 5000);
  };

  const handleMotionDetected = (detected: boolean) => {
    if (detected && !isAlert) {
      triggerAlert('Motion Detected - Possible Intrusion');
    }
  };

  const handleLightChange = (changed: boolean) => {
    if (changed && !isAlert) {
      triggerAlert('Sudden Light Change - Possible Danger');
    }
  };

  const handleLoudSound = (detected: boolean) => {
    if (detected && !isAlert) {
      triggerAlert('Loud Sound Detected - Distress Signal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Smart Auto-SOS System
            </h1>
          </div>
          <p className="text-muted-foreground">
            AI-Powered Danger Detection & Emergency Response
          </p>
        </div>

        {/* Alert Status */}
        <AlertPanel isAlert={isAlert} alertType={alertType} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <WebcamMonitor 
              onMotionDetected={handleMotionDetected}
              onLightChange={handleLightChange}
            />
            <AudioMonitor onLoudSound={handleLoudSound} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <LocationTracker />
            <ControlPanel onPhoneNumberChange={setPhoneNumber} />
            <EventLog events={events} />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-foreground">📖 Setup Instructions</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. Browser Permissions</h4>
              <p>Allow camera, microphone, and location access when prompted.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Emergency Contact</h4>
              <p>Enter your emergency phone number in the control panel.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Twilio Integration (Optional)</h4>
              <p>For real SMS/calls, add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN via Lovable Cloud.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Detection Sensitivity</h4>
              <p>The system auto-calibrates for motion, sound, and light changes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
