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
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                    <p className="text-muted-foreground">
                        Gestiona y visualiza el historial de tus clientes
                    </p>
                </div>
                <ExportButton segment="clients" />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clients.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {clients.filter((c) => c.stats.activeEvents > 0).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(clients.reduce((acc: number, c) => acc + c.stats.totalSpent, 0))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Clients Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                    {clients.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No hay clientes registrados
                        </div>
                    ) : (
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
