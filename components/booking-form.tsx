'use client'

import { useState } from 'react'
import { createEvent, CreateEventItem } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Product = {
    id: string
    name: string
    totalQuantity: number
}

export function BookingForm({ products }: { products: Product[] }) {
    const [name, setName] = useState('')
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [items, setItems] = useState<CreateEventItem[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAddItem = () => {
        setItems([...items, { productId: '', quantity: 1 }])
    }

    const handleRemoveItem = (index: number) => {
        const newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
    }

    const handleItemChange = (index: number, field: keyof CreateEventItem, value: any) => {
        const newItems = [...items]
        if (field === 'quantity') {
            newItems[index].quantity = parseInt(value) || 0
        } else {
            newItems[index].productId = value
        }
        setItems(newItems)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!startDate || !endDate || !name) {
            toast.error('Por favor completa todos los campos requeridos')
            return
        }
        if (items.length === 0) {
            toast.error('Agrega al menos un producto')
            return
        }

        setIsSubmitting(true)
        try {
            const result = await createEvent({
                name,
                startDate,
                endDate,
                items,
            })

            if (result.success) {
                toast.success('Reserva creada exitosamente')
                // Reset form
                setName('')
                setStartDate(undefined)
                setEndDate(undefined)
                setItems([])
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('Error inesperado')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Detalles de la Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Evento / Cliente</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Boda García" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Fecha Inicio</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP", { locale: es }) : <span>Seleccionar</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label>Fecha Fin</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP", { locale: es }) : <span>Seleccionar</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Productos</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                            <Plus className="h-4 w-4 mr-2" /> Agregar Item
                        </Button>
                    </div>

                    {items.map((item, index) => (
                        <div key={index} className="flex gap-2 items-end">
                            <div className="flex-1">
                                <Select value={item.productId} onValueChange={(val) => handleItemChange(index, 'productId', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Producto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.name} (Disp: {p.totalQuantity})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-24">
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    min="1"
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear Reserva'}
                </Button>
            </CardFooter>
        </Card>
    )
}
