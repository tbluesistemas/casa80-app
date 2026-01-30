'use client'

import { useState, useMemo } from 'react'
import { updateEvent } from '@/lib/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Plus, Trash2 } from 'lucide-react'

interface EditEventFormProps {
    event: {
        id: string
        name: string
        startDate: Date
        endDate: Date
        status: string
        notes?: string | null
        items: {
            productId: string
            quantity: number
            product: {
                name: string
                totalQuantity: number
                priceUnit: number
            }
        }[]
    }
    allProducts: {
        id: string
        name: string
        totalQuantity: number
        priceUnit: number
    }[]
}

export function EditEventForm({ event, allProducts }: EditEventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: event.name,
        startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(event.endDate), 'yyyy-MM-dd'),
        status: event.status,
        notes: event.notes || '',
    })

    // State for items
    const [items, setItems] = useState<{ productId: string; quantity: number; productName: string; priceUnit: number }[]>(
        event.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            productName: item.product.name,
            priceUnit: item.product.priceUnit
        }))
    )

    // State for new item selection
    const [selectedProductId, setSelectedProductId] = useState<string>("")

    const totalCost = useMemo(() => {
        return items.reduce((acc, item) => acc + (item.quantity * item.priceUnit), 0)
    }, [items])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const validItems = items.filter(i => i.quantity > 0).map(i => ({
            productId: i.productId,
            quantity: i.quantity
        }))

        const result = await updateEvent(event.id, {
            name: formData.name,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            status: formData.status,
            notes: formData.notes || undefined,
            items: validItems
        })

        if (result.success) {
            toast.success('Reserva actualizada correctamente')
            router.push('/events')
        } else {
            toast.error(result.error)
        }
        setLoading(false)
    }

    const handleQuantityChange = (productId: string, newQuantity: string) => {
        const qty = parseInt(newQuantity)
        if (isNaN(qty) || qty < 0) return

        setItems(items.map(item =>
            item.productId === productId ? { ...item, quantity: qty } : item
        ))
    }

    const handleAddItem = () => {
        if (!selectedProductId) return

        const product = allProducts.find(p => p.id === selectedProductId)
        if (!product) return

        if (items.some(i => i.productId === selectedProductId)) {
            toast.error("El producto ya está en la lista")
            return
        }

        setItems([...items, {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            priceUnit: product.priceUnit
        }])
        setSelectedProductId("")
    }

    const handleRemoveItem = (productId: string) => {
        setItems(items.filter(i => i.productId !== productId))
    }

    const isEditable = ['SIN_CONFIRMAR', 'RESERVADO'].includes(event.status)

    const availableProducts = allProducts.filter(p => !items.some(i => i.productId === p.id))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Información de la Reserva</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre del Evento *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="startDate">Fecha de Inicio *</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endDate">Fecha de Fin *</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 pb-2 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium">Artículos Reservados</h3>
                            <p className="text-sm text-gray-500">
                                {isEditable
                                    ? "Gestiona los artículos de la reserva."
                                    : "No se pueden modificar artículos en este estado."}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Total Estimado</div>
                            <div className="text-2xl font-bold text-primary">
                                ${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    {isEditable && (
                        <div className="flex gap-2 items-end border p-4 rounded-md bg-muted/20">
                            <div className="grid gap-2 flex-1">
                                <Label htmlFor="addProduct">Agregar Producto</Label>
                                <Select
                                    value={selectedProductId}
                                    onValueChange={setSelectedProductId}
                                    disabled={availableProducts.length === 0}
                                >
                                    <SelectTrigger id="addProduct">
                                        <SelectValue placeholder={
                                            availableProducts.length === 0
                                                ? "Todos los productos han sido agregados"
                                                : "Seleccionar producto..."
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableProducts.map(product => (
                                            <SelectItem key={product.id} value={product.id}>
                                                {product.name} - ${product.priceUnit} (Stock: {product.totalQuantity})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" onClick={handleAddItem} disabled={!selectedProductId}>
                                <Plus className="w-4 h-4 mr-2" /> Agregar
                            </Button>
                        </div>
                    )}

                    <div className="space-y-3 mt-4">
                        {items.length === 0 && (
                            <div className="text-center p-8 border border-dashed rounded text-gray-400">
                                No hay artículos seleccionados
                            </div>
                        )}
                        {items.map((item) => (
                            <div key={item.productId} className="flex items-center justify-between border p-3 rounded-md bg-card">
                                <div>
                                    <div className="font-medium">{item.productName}</div>
                                    <div className="text-sm text-gray-500">Unit: ${item.priceUnit}</div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right w-24">
                                        <div className="font-semibold">
                                            ${(item.quantity * item.priceUnit).toLocaleString('es-MX')}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor={`qty-${item.productId}`} className="sr-only">Cantidad</Label>
                                        <Input
                                            id={`qty-${item.productId}`}
                                            type="number"
                                            className="w-20 text-right"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                                            disabled={!isEditable}
                                            min={1}
                                        />
                                        {isEditable && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive/90"
                                                onClick={() => handleRemoveItem(item.productId)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-2 pt-4">
                        <Label htmlFor="status">Estado</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SIN_CONFIRMAR">Sin Confirmar</SelectItem>
                                <SelectItem value="RESERVADO">Reservado</SelectItem>
                                <SelectItem value="DESPACHADO">Despachado</SelectItem>
                                <SelectItem value="COMPLETADO">Completado</SelectItem>
                                <SelectItem value="CANCELADO">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                            placeholder="Notas adicionales sobre la reserva..."
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => router.push('/events')}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
