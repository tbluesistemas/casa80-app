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
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Link href="/inventory">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Historial de Productos Dañados</h2>
                            <p className="text-muted-foreground">
                                Gestiona y rastrea productos dañados y su restauración
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ExportButton segment="damages" />
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-sm text-muted-foreground">Costo Total Pendiente</div>
                        <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(totalCost)}
                        </div>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Productos Dañados</CardTitle>
                            <CardDescription>
                                {items.length} {items.length === 1 ? 'producto' : 'productos'} en el historial
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filter === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('all')}
                            >
                                Todos
                            </Button>
                            <Button
                                variant={filter === 'pending' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('pending')}
                            >
                                Pendientes
                            </Button>
                            <Button
                                variant={filter === 'restored' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter('restored')}
                            >
                                Restaurados
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">Cargando...</p>
                            </div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No hay productos dañados</p>
                            <p className="text-sm text-muted-foreground">
                                {filter === 'pending' && 'No hay daños pendientes de restauración'}
                                {filter === 'restored' && 'No hay productos restaurados'}
                                {filter === 'all' && 'No se han registrado daños'}
                            </p>
                        </div>
                    ) : (
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
                                            <TableCell className="text-right font-medium">
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
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(item.restoredAt)}
                                                    </span>
                                                )}
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
