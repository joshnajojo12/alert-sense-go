import { useGeolocation } from '@/hooks/useGeolocation';
import { Card } from '@/components/ui/card';
import { AlertCircle, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LocationTracker = () => {
  const { latitude, longitude, error, googleMapsUrl } = useGeolocation();

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Live Location</h3>
      </div>
      
      {error ? (
        <div className="flex items-center gap-2 p-4 bg-warning/10 border border-warning rounded-lg">
          <AlertCircle className="w-5 h-5 text-warning" />
          <span className="text-sm text-warning">{error}</span>
        </div>
      ) : latitude && longitude ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Latitude:</span>
              <div className="font-mono text-foreground">{latitude.toFixed(6)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Longitude:</span>
              <div className="font-mono text-foreground">{longitude.toFixed(6)}</div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(googleMapsUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Google Maps
          </Button>
          
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`}
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-4">
          Acquiring location...
        </div>
      )}
    </Card>
  );
};
