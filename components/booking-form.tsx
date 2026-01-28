'use client'

import { useState, useMemo, useEffect } from 'react'
import { createEvent, CreateEventItem } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Minus, Plus, Search, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ClientSelector } from '@/components/client-selector'

type Product = {
    id: string
    name: string
    totalQuantity: number
}

// Internal type for easier state management
type CartItems = { [key: string]: number }

export function BookingForm({ products }: { products: Product[] }) {
    // Form State
    const [name, setName] = useState('')
    const [clientId, setClientId] = useState<string | undefined>()
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [isAllDay, setIsAllDay] = useState(false)
    const [notes, setNotes] = useState('')

    // Product State
    const [searchTerm, setSearchTerm] = useState('')
    const [cart, setCart] = useState<CartItems>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Filtered Products
    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [products, searchTerm])

    // Cart Logic
    const handleUpdateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            const current = prev[productId] || 0
            const next = Math.max(0, current + delta)

            // Check stock limit
            const product = products.find(p => p.id === productId)
            if (product && next > product.totalQuantity) {
                toast.error(`Solo hay ${product.totalQuantity} unidades disponibles`)
                return prev
            }

            if (next === 0) {
                const { [productId]: _, ...rest } = prev
                return rest
            }
            return { ...prev, [productId]: next }
        })
    }

    const handleSetQuantity = (productId: string, value: string) => {
        // Treat empty string as 0
        const qty = value === '' ? 0 : parseInt(value)

        if (isNaN(qty)) return

        setCart(prev => {
            const product = products.find(p => p.id === productId)

            if (!product) return prev

            // Enforce limits
            if (qty > product.totalQuantity) {
                toast.error(`Solo hay ${product.totalQuantity} unidades disponibles`)
                return { ...prev, [productId]: product.totalQuantity }
            }

            if (qty <= 0) {
                const { [productId]: _, ...rest } = prev
                return rest
            }

            return { ...prev, [productId]: qty }
        })
    }

    const handleSubmit = async () => {
        // Validation
        if (!name) return toast.error('Ingresa el nombre del evento/cliente')
        if (!startDate) return toast.error('Selecciona la fecha de inicio')

        let finalEndDate = endDate
        if (isAllDay) {
            // If all day, end date is same as start date (logic wise)
            // or we could set it to end of day. For now, same date.
            finalEndDate = startDate
        } else {
            if (!finalEndDate) return toast.error('Selecciona la fecha de fin')
        }

        const items: CreateEventItem[] = Object.entries(cart).map(([id, qty]) => ({
            productId: id,
            quantity: qty
        }))

        if (items.length === 0) return toast.error('Selecciona al menos un producto')

        setIsSubmitting(true)
        try {
            const result = await createEvent({
                name,
                clientId,
                startDate,
                endDate: finalEndDate!,
                notes,
                items,
            })

            if (result.success) {
                toast.success('Reserva creada exitosamente')
                // Reset
                setName('')
                setClientId(undefined)
                setStartDate(undefined)
                setEndDate(undefined)
                setNotes('')
                setCart({})
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('Error procesando la solicitud')
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedCount = Object.keys(cart).length
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* LEFT COLUMN: Event Details */}
            <div className="w-[400px] flex flex-col gap-4 overflow-y-auto pr-2">
                <Card className="h-full border-none shadow-none bg-transparent">
                    <CardContent className="p-0 space-y-6">

                        {/* Name / Client Selector */}
                        <div className="space-y-2">
                            <Label>Cliente</Label>
                            <ClientSelector
                                selectedClient={clientId ? { id: clientId, name: name } : null}
                                onSelect={(client) => {
                                    setClientId(client.id)
                                    setName(client.name)
                                }}
                            />
                            {/* Hidden or secondary input if they strictly want a custom event name different from client? 
                                For now, assume Event Name = Client Name based on user request "select client". 
                                But user might want to edit it? 
                                Actually, user said "select a client". 
                                I'll keep the selector. If they want to just type random text, ClientSelector allows creating new ones.
                            */}
                        </div>

                        {/* Dates */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="allDay"
                                    checked={isAllDay}
                                    onChange={(e) => setIsAllDay(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="allDay" className="cursor-pointer font-medium">Evento de todo el día</Label>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label>Desde</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "dd/MM/yyyy") : "Fecha Inicio"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {!isAllDay && (
                                    <div className="space-y-2">
                                        <Label>Hasta</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {endDate ? format(endDate, "dd/MM/yyyy") : "Fecha Fin"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label>Notas / Observaciones</Label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Escribe detalles importantes aquí..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="pt-4">
                            <Button className="w-full h-12 text-lg" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : `Confirmar Reserva (${totalItems} items)`}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Product Grid */}
            <div className="flex-1 flex flex-col gap-4 h-full bg-card/50 rounded-xl border p-4">
                {/* Search */}
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-9 h-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {selectedCount > 0 && (
                        <div className="flex items-center justify-between bg-accent/50 p-2 rounded-lg text-sm text-foreground font-medium">
                            <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> {selectedCount} productos</span>
                            <span>Total unidades: {totalItems}</span>
                        </div>
                    )}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto pr-2 pb-20">
                    {filteredProducts.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No se encontraron productos
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    quantity={cart[product.id] || 0}
                                    onUpdate={handleUpdateQuantity}
                                    onSet={handleSetQuantity}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ProductCard({
    product,
    quantity,
    onUpdate,
    onSet
}: {
    product: Product,
    quantity: number,
    onUpdate: (id: string, delta: number) => void
    onSet: (id: string, val: string) => void
}) {
    const [inputValue, setInputValue] = useState<string>("")
    const [isFocused, setIsFocused] = useState(false)

    // Sync input value with external quantity when not focused
    useEffect(() => {
        if (!isFocused) {
            setInputValue(quantity === 0 ? "" : quantity.toString())
        }
    }, [quantity, isFocused])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        onSet(product.id, e.target.value)
    }

    const handleFocus = () => {
        setIsFocused(true)
        setInputValue(quantity === 0 ? "" : quantity.toString())
    }

    const handleBlur = () => {
        setIsFocused(false)
        if (inputValue === "" || parseInt(inputValue) === 0) {
            onSet(product.id, "0")
        }
    }

    // Show controls if quantity > 0 OR if we are currently editing (focused)
    const showControls = quantity > 0 || isFocused

    return (
        <div
            className={cn(
                "group relative flex flex-col justify-between rounded-lg border bg-card p-4 transition-all hover:bg-accent/50 cursor-pointer",
                showControls ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"
            )}
            onClick={() => !showControls && onUpdate(product.id, 1)}
        >
            <div className="space-y-1">
                <h3 className="font-semibold leading-tight">{product.name}</h3>
                <p className="text-xs text-muted-foreground">Disp: {product.totalQuantity}</p>
            </div>

            <div className="mt-4 flex items-center justify-end">
                {showControls ? (
                    <div className="flex items-center gap-2 bg-background rounded-md border shadow-sm p-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdate(product.id, -1)}>
                            <Minus className="h-3 w-3" />
                        </Button>

                        <input
                            type="number"
                            className="w-12 text-center text-sm font-bold bg-transparent border-none appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
                            value={isFocused ? inputValue : quantity}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdate(product.id, 1)}>
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <Button size="icon" variant="secondary" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
