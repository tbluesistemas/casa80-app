import { getEvents } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventsList } from "@/components/events-list";
import { getCurrentRole } from "@/lib/auth";

export default async function EventsPage() {
    const { data: events } = await getEvents();
    const role = await getCurrentRole();

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Reservas</h2>
                {role === 'ADMIN' && (
                    <Link href="/events/new">
                        <Button>Nueva Reserva</Button>
                    </Link>
                )}
            </div>

            <EventsList events={events || []} role={role} />
        </div>
    );
}
