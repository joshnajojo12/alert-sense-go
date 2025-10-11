import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';

export interface LogEvent {
  id: string;
  timestamp: Date;
  type: string;
  location?: string;
}

interface EventLogProps {
  events: LogEvent[];
}

export const EventLog = ({ events }: EventLogProps) => {
  return (
    <Card className="p-4 bg-card border-border h-full">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Event Log</h3>
      </div>
      
      <ScrollArea className="h-[200px]">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No events recorded yet
          </p>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-3 bg-secondary rounded-lg border border-border"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-foreground">
                    {event.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {event.location && (
                  <p className="text-xs text-muted-foreground">
                    📍 {event.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
