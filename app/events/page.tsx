import { getEvents } from "@/lib/actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function EventsPage() {
    const { data: events } = await getEvents();

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Reservas</h2>
                <Link href="/events/new">
                    <Button>Nueva Reserva</Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead>Fin</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events?.map((event: any) => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.name}</TableCell>
                                <TableCell>{format(event.startDate, "PPP", { locale: es })}</TableCell>
                                <TableCell>{format(event.endDate, "PPP", { locale: es })}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        event.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {event.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {event.status === 'BOOKED' && (
                                        <Link href={`/events/${event.id}/return`}>
                                            <Button variant="outline" size="sm">Registrar Devolución</Button>
                                        </Link>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!events || events.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">No hay reservas registradas.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
