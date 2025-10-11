import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Phone, Settings } from 'lucide-react';

interface ControlPanelProps {
  onPhoneNumberChange: (phone: string) => void;
}

export const ControlPanel = ({ onPhoneNumberChange }: ControlPanelProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSave = () => {
    onPhoneNumberChange(phoneNumber);
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Emergency Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone" className="text-foreground mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergency Phone Number
          </Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-secondary border-border text-foreground"
            />
            <Button onClick={handleSave} variant="default">
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This number will be called/messaged when danger is detected
          </p>
        </div>
      </div>
    </Card>
  );
};
