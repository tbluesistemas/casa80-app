'use client'

import { useState } from 'react'
import { registerReturn, ReturnItem } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type EventWithItems = {
    id: string
    name: string
    status: string
    items: {
        productId: string
        quantity: number
        returnedGood: number
        returnedDamaged: number
        product: {
            name: string
            priceReplacement: number
        }
    }[]
}

export function ReturnForm({ event }: { event: EventWithItems }) {
    const router = useRouter()

    // Determine if we are editing an existing return or starting a new one
    // If status is COMPLETADO, we assume we are editing -> load values from DB
    // If not, we assume new return -> default to all good
    const isEditing = event.status === 'COMPLETADO'

    const [items, setItems] = useState<ReturnItem[]>(
        event.items.map(item => ({
            productId: item.productId,
            returnedGood: isEditing ? item.returnedGood : item.quantity,
            returnedDamaged: isEditing ? item.returnedDamaged : 0
        }))
    )
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (index: number, field: 'returnedGood' | 'returnedDamaged', value: string) => {
        const val = value === '' ? 0 : parseInt(value) || 0
        const newItems = [...items]
        newItems[index][field] = val
        setItems(newItems)
    }

    // Calculate total damage cost live
    const totalDamage = items.reduce((sum, item, idx) => {
        const product = event.items.find(i => i.productId === item.productId)?.product
        return sum + (item.returnedDamaged * (product?.priceReplacement || 0))
    }, 0)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const result = await registerReturn(event.id, items)
            if (result.success) {
                const cost = result.data?.totalDamageCost || 0
                if (cost > 0) {
                    toast.warning(`Devolución registrada. Costo de daños: $${cost.toFixed(2)}`)
                } else {
                    toast.success('Devolución registrada sin daños.')
                }
                router.push('/events')
            } else {
                toast.error(result.error)
            }
        } catch (e) {
            toast.error('Error al procesar devolución')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader className="px-4 md:px-6">
                <CardTitle className="text-base md:text-lg">Items del Evento: {event.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 md:p-6">
                {/* Mobile: Cards */}
                <div className="md:hidden divide-y">
                    {event.items.map((originalItem, index) => (
                        <div key={originalItem.productId} className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="font-medium text-sm">{originalItem.product.name}</div>
                                <div className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                    Entregado: {originalItem.quantity}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Devuelto (OK)</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="text-center h-9"
                                        value={items[index].returnedGood === 0 ? '' : items[index].returnedGood}
                                        onChange={(e) => handleChange(index, 'returnedGood', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-destructive">Dañado</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="text-center h-9 border-red-200 focus-visible:ring-red-500"
                                        value={items[index].returnedDamaged === 0 ? '' : items[index].returnedDamaged}
                                        onChange={(e) => handleChange(index, 'returnedDamaged', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-[11px]">
                                <span className="text-muted-foreground italic">Valor Daño Unitario:</span>
                                <span className="text-red-600 font-bold">${originalItem.product.priceReplacement.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop: Table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-right">Entregado</TableHead>
                                <TableHead className="w-32 text-center">Devuelto (Bien)</TableHead>
                                <TableHead className="w-32 text-center">Dañado</TableHead>
                                <TableHead className="text-right">Valor Daño (Unit)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {event.items.map((originalItem, index) => (
                                <TableRow key={originalItem.productId}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{originalItem.product.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{originalItem.quantity}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="0"
                                            className="text-center"
                                            value={items[index].returnedGood === 0 ? '' : items[index].returnedGood}
                                            onChange={(e) => handleChange(index, 'returnedGood', e.target.value)}
                                            placeholder="0"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="0"
                                            className="text-center border-red-200 focus-visible:ring-red-500"
                                            value={items[index].returnedDamaged === 0 ? '' : items[index].returnedDamaged}
                                            onChange={(e) => handleChange(index, 'returnedDamaged', e.target.value)}
                                            placeholder="0"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right text-red-600 font-medium">
                                        ${originalItem.product.priceReplacement.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {totalDamage > 0 && (
                    <div className="p-4 md:p-0 md:mt-6 flex justify-end">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-right w-full sm:w-auto">
                            <span className="text-xs sm:text-sm text-red-600 uppercase font-semibold block">Total a Pagar por Daños</span>
                            <span className="text-xl sm:text-2xl font-bold text-red-700">${totalDamage.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="px-4 md:px-6 pb-6">
                <Button className="w-full h-11 md:h-10 text-base md:text-sm" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Procesando...' : 'Finalizar Devolución'}
                </Button>
            </CardFooter>
        </Card>
    )
}
