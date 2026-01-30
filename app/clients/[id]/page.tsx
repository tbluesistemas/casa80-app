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
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/clients">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{client.name}</h2>
                    <p className="text-muted-foreground">
                        Cliente desde {formatDate(client.createdAt)}
                    </p>
                </div>
            </div>

            {/* Client Info & Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{client.stats.totalEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Eventos Activos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{client.stats.activeEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completados</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{client.stats.completedEvents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(client.stats.totalSpent)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {client.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{client.email}</span>
                        </div>
                    )}
                    {client.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{client.phone}</span>
                        </div>
                    )}
                    {client.address && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{client.address}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Events History */}
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Alquileres</CardTitle>
                </CardHeader>
                <CardContent>
                    {client.events.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Este cliente no tiene eventos registrados
                        </div>
                    ) : (
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
