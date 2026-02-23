import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { getEventStatus, getStatusVariant } from "@/lib/eventStatus";
import { Event } from "@/types";

const EventsPreviewSection = ({ events }: { events: Event[] }) => {
  return (
    <section className="py-24 border-t">
      <div className="container mx-auto px-4">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Events</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">Upcoming Events</h2>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.map((event) => {
              const status = getEventStatus(event.eventDate);
              if (status == "ended") return null;
              return (
                <div key={event.id} className="border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-mono text-base font-semibold">{event.name}</h3>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                        {event.eventType}
                      </Badge>
                      <Badge variant={getStatusVariant(status)} className="font-mono text-[10px] uppercase tracking-wider">
                        {status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  {event.eventDate && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                      <Calendar size={12} />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="font-mono text-xs gap-1">
                      Register <ArrowRight size={12} />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No upcoming events at the moment. Check back soon!</p>
        )}
      </div>
    </section>
  );
};

export default EventsPreviewSection;
