'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getDamagedProductsHistory, markDamageAsRestored } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { ExportButton } from "@/components/export/export-button"

type FilterType = 'all' | 'pending' | 'restored'

export default function DamagedProductsPage() {
    const router = useRouter()
    const [filter, setFilter] = useState<FilterType>('pending')
    const [items, setItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [filter])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const filterValue = filter === 'all' ? undefined : filter === 'restored'
            const result = await getDamagedProductsHistory({ showRestored: filterValue })
            if (result.success && result.data) {
                setItems(result.data)
            }
        } catch (error) {
            console.error('Error loading damaged products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRestore = async (itemId: string) => {
        if (!confirm('¿Marcar este producto como restaurado?')) return

        const result = await markDamageAsRestored(itemId)
        if (result.success) {
            loadData() // Reload data
        } else {
            alert('Error al marcar como restaurado')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date(date))
    }

    const totalCost = items.reduce((acc, item) => {
        if (!item.damageRestored) {
            return acc + (item.returnedDamaged * item.product.priceReplacement)
        }
        return acc
    }, 0)

    return (
        <div className="flex-1 space-y-4 md:space-y-8 p-4 md:p-8 pt-4 md:pt-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Link href="/inventory">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Historial de Daños</h2>
                            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                                Gestiona y rastrea productos dañados y su restauración
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 bg-red-50 p-3 rounded-lg border border-red-100">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-red-600">Total Pendiente</span>
                            <div className="text-lg md:text-2xl font-bold text-red-700">
                                {formatCurrency(totalCost)}
                            </div>
                        </div>
                        <ExportButton segment="damages" />
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg md:text-xl">Productos Dañados</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                {items.length} registrados
                            </CardDescription>
                        </div>
                        <div className="flex gap-1 bg-muted p-1 rounded-md self-start md:self-auto">
                            <Button
                                variant={filter === 'all' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('all')}
                                className="h-7 text-xs px-2"
                            >
                                Todos
                            </Button>
                            <Button
                                variant={filter === 'pending' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('pending')}
                                className="h-7 text-xs px-2"
                            >
                                Pendientes
                            </Button>
                            <Button
                                variant={filter === 'restored' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilter('restored')}
                                className="h-7 text-xs px-2"
                            >
                                Restaurados
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 md:p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">Cargando...</p>
                            </div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center p-4">
                            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No hay productos dañados</p>
                            <p className="text-sm text-muted-foreground">
                                {filter === 'pending' && 'No hay daños pendientes de restauración'}
                                {filter === 'restored' && 'No hay productos restaurados'}
                                {filter === 'all' && 'No se han registrado daños'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile View: Cards */}
                            <div className="md:hidden divide-y">
                                {items.map((item) => {
                                    const cost = item.returnedDamaged * item.product.priceReplacement
                                    return (
                                        <div key={item.id} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="min-w-0">
                                                    <div className="font-bold text-sm truncate">{item.product.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Cant: <strong className="text-foreground">{item.returnedDamaged}</strong> ·
                                                        Costo: <strong className="text-red-600">{formatCurrency(cost)}</strong>
                                                    </div>
                                                </div>
                                                {item.damageRestored ? (
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-green-50 text-green-700 border-green-200">
                                                        Restaurado
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-50 text-red-700 border-red-200">
                                                        Pendiente
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-muted-foreground">Evento</span>
                                                    <Link href={`/events/${item.event.id}`} className="text-primary truncate font-medium">
                                                        {item.event.name}
                                                    </Link>
                                                </div>
                                                <div className="flex flex-col gap-0.5 text-right">
                                                    <span className="text-muted-foreground">Fecha Evento</span>
                                                    <span>{formatDate(item.event.endDate)}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-1 border-t">
                                                <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                                                    {item.event.client?.name || 'Sin cliente'}
                                                </div>
                                                {!item.damageRestored ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRestore(item.id)}
                                                        className="h-7 text-[10px] gap-1 px-2"
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Restaurar
                                                    </Button>
                                                ) : item.restoredAt && (
                                                    <span className="text-[10px] text-muted-foreground italic">
                                                        Restaurado: {formatDate(item.restoredAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Desktop View: Table */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead className="text-center">Cantidad</TableHead>
                                            <TableHead>Evento</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead className="text-right">Costo</TableHead>
                                            <TableHead className="text-center">Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item) => {
                                            const cost = item.returnedDamaged * item.product.priceReplacement
                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        {item.product.name}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.returnedDamaged}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={`/events/${item.event.id}`} className="hover:underline text-primary">
                                                            {item.event.name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.event.client?.name || 'Sin cliente'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(item.event.endDate)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-red-600">
                                                        {formatCurrency(cost)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.damageRestored ? (
                                                            <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-600 border-green-600/20">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Restaurado
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="gap-1 bg-red-500/10 text-red-600 border-red-600/20">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                Pendiente
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {!item.damageRestored && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleRestore(item.id)}
                                                                className="gap-2"
                                                            >
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Restaurar
                                                            </Button>
                                                        )}
                                                        {item.damageRestored && item.restoredAt && (
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {formatDate(item.restoredAt)}
                                                            </span>
                                                        )}
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
