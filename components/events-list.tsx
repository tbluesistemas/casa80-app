'use client'

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, RotateCcw, Pencil } from "lucide-react";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { EventStatus } from "@/lib/event-status";
import type { UserRole } from "@/lib/auth";

type Event = {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
};

export function EventsList({ events, role }: { events: Event[], role: UserRole }) {
    const [tab, setTab] = useState<'active' | 'history'>('active');

    const activeEvents = events.filter(e => ['SIN_CONFIRMAR', 'RESERVADO', 'DESPACHADO'].includes(e.status));
    const historyEvents = events.filter(e => ['COMPLETADO', 'CANCELADO'].includes(e.status));

    const displayedEvents = tab === 'active' ? activeEvents : historyEvents;

    return (
        <div className="space-y-4">
            <div className="flex space-x-2 border-b">
                <button
                    onClick={() => setTab('active')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'active'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Reservas Activas ({activeEvents.length})
                </button>
                <button
                    onClick={() => setTab('history')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'history'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Historial ({historyEvents.length})
                </button>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[150px]">Nombre</TableHead>
                            <TableHead className="min-w-[120px]">Inicio</TableHead>
                            <TableHead className="min-w-[120px]">Fin</TableHead>
                            <TableHead className="min-w-[100px]">Estado</TableHead>
                            <TableHead className="text-right min-w-[120px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedEvents.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.name}</TableCell>
                                <TableCell className="whitespace-nowrap">{format(new Date(event.startDate), "PPP", { locale: es })}</TableCell>
                                <TableCell className="whitespace-nowrap">{format(new Date(event.endDate), "PPP", { locale: es })}</TableCell>
                                <TableCell>
                                    <EventStatusBadge status={event.status as EventStatus} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {role === 'ADMIN' && ['SIN_CONFIRMAR', 'RESERVADO'].includes(event.status) && (
                                            <>
                                                <Link href={`/events/${event.id}/edit`}>
                                                    <Button variant="ghost" size="icon" title="Editar Reserva">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/events/${event.id}/return`}>
                                                    <Button variant="ghost" size="icon" title="Registrar Devolución">
                                                        <RotateCcw className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </>
                                        )}
                                        <Link href={`/events/${event.id}`}>
                                            <Button variant="ghost" size="icon" title="Ver Detalles">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {displayedEvents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    {tab === 'active' ? 'No hay reservas activas.' : 'No hay historial de eventos.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
