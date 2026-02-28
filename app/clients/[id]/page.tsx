import { getClientById } from '@/lib/client-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { EventStatusBadge } from '@/components/events/event-status-badge'
import { EventStatus } from '@/lib/event-status'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await getClientById(id)

    if (!result.success || !result.data) {
        return (
            <div className="flex-1 p-8">
                <div className="text-center text-red-600">
                    Error al cargar cliente: {result.error}
                </div>
            </div>
        )
    }

    const client = result.data

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
    }

    const formatDate = (date: Date) => {
        return format(new Date(date), 'dd MMM yyyy', { locale: es })
    }

    return (
        <div className="flex-1 space-y-4 md:space-y-8 p-4 md:p-8 pt-4 md:pt-6">
            {/* Header */}
            <div className="flex items-center gap-2 md:gap-4">
                <Link href="/clients">
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight truncate max-w-[200px] sm:max-w-none">{client.name}</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">
                        Cliente desde {formatDate(client.createdAt)}
                    </p>
                </div>
            </div>

            {/* Client Info & Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Total Eventos</CardTitle>
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">{client.stats.totalEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Activos</CardTitle>
                        <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">{client.stats.activeEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Completados</CardTitle>
                        <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">{client.stats.completedEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Total Gastado</CardTitle>
                        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg md:text-2xl font-bold">{formatCurrency(client.stats.totalSpent)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Info */}
            <Card>
                <CardHeader className="px-4 md:px-6">
                    <CardTitle className="text-lg">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 md:px-6">
                    {client.email && (
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="truncate">{client.email}</span>
                        </div>
                    )}
                    {client.phone && (
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{client.phone}</span>
                        </div>
                    )}
                    {client.address && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{client.address}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Events History */}
            <Card>
                <CardHeader className="px-4 md:px-6">
                    <CardTitle className="text-lg">Historial de Alquileres</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {client.events.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Este cliente no tiene eventos registrados
                        </div>
                    ) : (
                        <>
                            {/* Mobile: Cards */}
                            <div className="md:hidden divide-y">
                                {client.events.map((event) => {
                                    const eventTotal = event.items.reduce((sum, item) =>
                                        sum + (item.quantity * item.product.priceUnit), 0
                                    )
                                    return (
                                        <div key={event.id} className="p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-primary truncate">{event.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                                    </div>
                                                </div>
                                                <EventStatusBadge status={event.status as EventStatus} />
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="text-muted-foreground">
                                                    {event.items.length} producto{event.items.length !== 1 ? 's' : ''}
                                                </div>
                                                <div className="font-bold">{formatCurrency(eventTotal)}</div>
                                            </div>
                                            <Link href={`/events/${event.id}`} className="block">
                                                <Button variant="outline" size="sm" className="w-full text-xs h-8">
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Desktop: Table */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Evento</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Productos</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {client.events.map((event) => {
                                            const eventTotal = event.items.reduce((sum, item) =>
                                                sum + (item.quantity * item.product.priceUnit), 0
                                            )
                                            return (
                                                <TableRow key={event.id}>
                                                    <TableCell className="font-medium">{event.name}</TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <EventStatusBadge status={event.status as EventStatus} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {event.items.length} producto{event.items.length !== 1 ? 's' : ''}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {formatCurrency(eventTotal)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={`/events/${event.id}`}>
                                                            <Button variant="ghost" size="sm">
                                                                Ver Detalles
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
