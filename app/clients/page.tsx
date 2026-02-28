import { getAllClientsWithStats } from '@/lib/client-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Users, Mail, Phone, MapPin, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { ExportButton } from '@/components/export/export-button'

export default async function ClientsPage() {
    const result = await getAllClientsWithStats()

    if (!result.success || !result.data) {
        return (
            <div className="flex-1 p-8">
                <div className="text-center text-red-600">
                    Error al cargar clientes: {result.error}
                </div>
            </div>
        )
    }

    const clients = result.data

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
    }

    return (
        <div className="flex-1 space-y-4 md:space-y-8 p-4 md:p-8 pt-4 md:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-sm text-muted-foreground">
                        Gestiona y visualiza el historial de tus clientes
                    </p>
                </div>
                <ExportButton segment="clients" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Total Clientes</CardTitle>
                        <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">{clients.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Activos</CardTitle>
                        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">
                            {clients.filter((c) => c.stats.activeEvents > 0).length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-2 md:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Ingresos Totales</CardTitle>
                        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">
                            {formatCurrency(clients.reduce((acc: number, c) => acc + c.stats.totalSpent, 0))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Clients Content */}
            <Card>
                <CardHeader className="px-4 md:px-6">
                    <CardTitle>Lista de Clientes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {clients.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No hay clientes registrados
                        </div>
                    ) : (
                        <>
                            {/* Mobile: Cards */}
                            <div className="md:hidden divide-y">
                                {clients.map((client) => (
                                    <Link key={client.id} href={`/clients/${client.id}`} className="block p-4 space-y-3 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold text-primary truncate">{client.name}</div>
                                                {client.address && (
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                                                        <MapPin className="h-3 w-3 shrink-0" />
                                                        {client.address}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-bold text-sm">{formatCurrency(client.stats.totalSpent)}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-xs">
                                            {client.phone && (
                                                <div className="text-muted-foreground flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {client.phone}
                                                </div>
                                            )}
                                            {client.email && (
                                                <div className="text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {client.email}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="text-[10px] px-1.5">
                                                {client.stats.totalEvents} Eventos
                                            </Badge>
                                            {client.stats.activeEvents > 0 && (
                                                <Badge variant="default" className="text-[10px] px-1.5">
                                                    {client.stats.activeEvents} Activos
                                                </Badge>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Desktop: Table */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead className="text-center">Total Eventos</TableHead>
                                            <TableHead className="text-center">Activos</TableHead>
                                            <TableHead className="text-right">Total Gastado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {clients.map((client) => (
                                            <TableRow
                                                key={client.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                            >
                                                <TableCell>
                                                    <Link href={`/clients/${client.id}`} className="block">
                                                        <div className="font-medium">{client.name}</div>
                                                        {client.address && (
                                                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {client.address}
                                                            </div>
                                                        )}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`/clients/${client.id}`} className="block">
                                                        {client.email && (
                                                            <div className="text-sm flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {client.email}
                                                            </div>
                                                        )}
                                                        {client.phone && (
                                                            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                                <Phone className="h-3 w-3" />
                                                                {client.phone}
                                                            </div>
                                                        )}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Link href={`/clients/${client.id}`} className="block">
                                                        <Badge variant="outline">
                                                            {client.stats.totalEvents}
                                                        </Badge>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Link href={`/clients/${client.id}`} className="block">
                                                        {client.stats.activeEvents > 0 ? (
                                                            <Badge variant="default">
                                                                {client.stats.activeEvents}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">0</span>
                                                        )}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    <Link href={`/clients/${client.id}`} className="block">
                                                        {formatCurrency(client.stats.totalSpent)}
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
