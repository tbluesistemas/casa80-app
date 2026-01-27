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
    items: {
        productId: string
        quantity: number
        product: {
            name: string
            priceReplacement: number
        }
    }[]
}

export function ReturnForm({ event }: { event: EventWithItems }) {
    const router = useRouter()
    // Initial state: map items to default returnedGood (0) and damaged (0)
    // Or pre-fill returnedGood with total quantity? Let's default to 0 to force check.
    const [items, setItems] = useState<ReturnItem[]>(
        event.items.map(item => ({
            productId: item.productId,
            returnedGood: item.quantity, // Default to all good
            returnedDamaged: 0
        }))
    )
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (index: number, field: 'returnedGood' | 'returnedDamaged', value: string) => {
        const val = parseInt(value) || 0
        const newItems = [...items]
        newItems[index][field] = val

        // Auto adjust the other field to match total quantity? Maybe too complex.
        // Just validation on submit.
        setItems(newItems)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        // Validation: sum should typically match total sent, or record missing?
        // For MVP, we pass what we have.

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
            <CardHeader>
                <CardTitle>Items del Evento: {event.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead className="text-right">Entregado</TableHead>
                            <TableHead className="w-32">Devuelto (Bien)</TableHead>
                            <TableHead className="w-32">Dañado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {event.items.map((originalItem, index) => (
                            <TableRow key={originalItem.productId}>
                                <TableCell>{originalItem.product.name}</TableCell>
                                <TableCell className="text-right">{originalItem.quantity}</TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={items[index].returnedGood}
                                        onChange={(e) => handleChange(index, 'returnedGood', e.target.value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={items[index].returnedDamaged}
                                        onChange={(e) => handleChange(index, 'returnedDamaged', e.target.value)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Procesando...' : 'Finalizar Devolución'}
                </Button>
            </CardFooter>
        </Card>
    )
}
