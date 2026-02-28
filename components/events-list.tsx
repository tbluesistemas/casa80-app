'use client'

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, RotateCcw, Pencil } from "lucide-react";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { EventStatus } from "@/lib/event-status";
import type { UserRole } from "@/lib/auth";
import { getEventHistory } from "@/lib/actions";

type Event = {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
};

type HistoryEntry = {
    id: string;
    eventId: string;
    event: { name: string };
    previousStatus: string | null;
    newStatus: string;
    changedBy: string | null;
    reason: string | null;
    createdAt: Date;
};

export function EventsList({ events, role }: { events: Event[], role: UserRole }) {
    const [tab, setTab] = useState<'active' | 'history'>('active');
    const [historyContainer, setHistoryContainer] = useState<HistoryEntry[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const activeEvents = events.filter(e => ['SIN_CONFIRMAR', 'RESERVADO', 'DESPACHADO'].includes(e.status));

    useEffect(() => {
        if (tab === 'history') {
            setLoadingHistory(true);
            getEventHistory()
                .then(res => {
                    if (res.success && res.data) {
                        setHistoryContainer(res.data);
                    }
                })
                .finally(() => setLoadingHistory(false));
        }
    }, [tab]);

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex space-x-2 border-b">
                <button
                    onClick={() => setTab('active')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'active'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Activas ({activeEvents.length})
                </button>
                <button
                    onClick={() => setTab('history')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'history'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Historial
                </button>
            </div>

            {tab === 'active' ? (
                <>
                    {/* Mobile: Cards */}
                    <div className="md:hidden space-y-3">
                        {activeEvents.length === 0 ? (
                            <p className="text-center text-muted-foreground py-12">No hay reservas activas.</p>
                        ) : activeEvents.map((event) => (
                            <div key={event.id} className="rounded-lg border bg-card p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        {role === 'ADMIN' ? (
                                            <Link href={`/events/${event.id}/edit`} className="font-semibold text-primary hover:underline">
                                                {event.name}
                                            </Link>
                                        ) : (
                                            <Link href={`/events/${event.id}`} className="font-semibold hover:underline">
                                                {event.name}
                                            </Link>
                                        )}
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(event.startDate), "dd MMM", { locale: es })} → {format(new Date(event.endDate), "dd MMM yyyy", { locale: es })}
                                        </div>
                                    </div>
                                    <EventStatusBadge status={event.status as EventStatus} />
                                </div>
                                <div className="flex gap-2 pt-1 border-t">
                                    <Link href={`/events/${event.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                                            <Eye className="h-3 w-3" /> Ver
                                        </Button>
                                    </Link>
                                    {role === 'ADMIN' && ['SIN_CONFIRMAR', 'RESERVADO', 'DESPACHADO'].includes(event.status) && (
                                        <>
                                            <Link href={`/events/${event.id}/edit`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                                                    <Pencil className="h-3 w-3" /> Editar
                                                </Button>
                                            </Link>
                                            <Link href={`/events/${event.id}/return`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                                                    <RotateCcw className="h-3 w-3" /> Dev.
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table */}
                    <div className="hidden md:block rounded-md border overflow-x-auto">
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
                                {activeEvents.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">
                                            {role === 'ADMIN' && ['SIN_CONFIRMAR', 'RESERVADO', 'DESPACHADO'].includes(event.status) ? (
                                                <Link href={`/events/${event.id}/edit`} className="hover:underline text-primary font-semibold">
                                                    {event.name}
                                                </Link>
                                            ) : (
                                                <Link href={`/events/${event.id}`} className="hover:underline">
                                                    {event.name}
                                                </Link>
                                            )}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{format(new Date(event.startDate), "PPP", { locale: es })}</TableCell>
                                        <TableCell className="whitespace-nowrap">{format(new Date(event.endDate), "PPP", { locale: es })}</TableCell>
                                        <TableCell>
                                            <EventStatusBadge status={event.status as EventStatus} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {role === 'ADMIN' && ['SIN_CONFIRMAR', 'RESERVADO', 'DESPACHADO'].includes(event.status) && (
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
                                {activeEvents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No hay reservas activas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </>
            ) : (
                <>
                    {/* Mobile: History Cards */}
                    <div className="md:hidden space-y-3">
                        {loadingHistory ? (
                            <p className="text-center text-muted-foreground py-12">Cargando historial...</p>
                        ) : historyContainer.length === 0 ? (
                            <p className="text-center text-muted-foreground py-12">No hay registros de historial.</p>
                        ) : historyContainer.map((entry) => (
                            <div key={entry.id} className="rounded-lg border bg-card p-4 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-sm">{entry.event.name}</span>
                                    <EventStatusBadge status={entry.newStatus as EventStatus} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(entry.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                                    {entry.changedBy && <> · {entry.changedBy}</>}
                                </p>
                                {entry.reason && <p className="text-xs text-muted-foreground">{entry.reason}</p>}
                            </div>
                        ))}
                    </div>

                    {/* Desktop: History Table */}
                    <div className="hidden md:block rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[150px]">Fecha</TableHead>
                                    <TableHead className="min-w-[150px]">Evento</TableHead>
                                    <TableHead className="min-w-[120px]">Cambio</TableHead>
                                    <TableHead className="min-w-[150px]">Usuario</TableHead>
                                    <TableHead className="min-w-[150px]">Notas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingHistory ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            Cargando historial...
                                        </TableCell>
                                    </TableRow>
                                ) : historyContainer.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No hay registros de historial.
                                        </TableCell>
                                    </TableRow>
                                ) : historyContainer.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="whitespace-nowrap font-medium">
                                            {format(new Date(entry.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                                        </TableCell>
                                        <TableCell>{entry.event.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-xs">
                                                {entry.previousStatus && entry.previousStatus !== entry.newStatus && (
                                                    <>
                                                        <span className="text-muted-foreground">{entry.previousStatus}</span>
                                                        <span className="text-muted-foreground">→</span>
                                                    </>
                                                )}
                                                <EventStatusBadge status={entry.newStatus as EventStatus} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{entry.changedBy}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{entry.reason || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </div>
    );
}
