'use client'

import { useState } from 'react'
import { createProduct } from '@/lib/actions'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { toast } from "sonner"

export function CreateProductDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        totalQuantity: 0,
        priceUnit: 0,
        priceReplacement: 0,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.error('El nombre del producto es requerido')
            return
        }

        setLoading(true)

        const result = await createProduct({
            name: formData.name,
            category: formData.category || undefined,
            description: formData.description || undefined,
            totalQuantity: formData.totalQuantity,
            priceUnit: formData.priceUnit,
            priceReplacement: formData.priceReplacement,
        })

        if (result.success) {
            toast.success('Producto creado correctamente')
            setOpen(false)
            // Reset form
            setFormData({
                name: '',
                category: '',
                description: '',
                totalQuantity: 0,
                priceUnit: 0,
                priceReplacement: 0,
            })
        } else {
            toast.error(result.error)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Producto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Ej: Mesa redonda"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="General"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                placeholder="Descripción del producto..."
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="quantity">Cantidad</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    value={formData.totalQuantity === 0 ? '' : formData.totalQuantity}
                                    onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="priceUnit">Valor Unit.</Label>
                                <Input
                                    id="priceUnit"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.priceUnit === 0 ? '' : formData.priceUnit}
                                    onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="priceReplacement">Valor Daño</Label>
                                <Input
                                    id="priceReplacement"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.priceReplacement === 0 ? '' : formData.priceReplacement}
                                    onChange={(e) => setFormData({ ...formData, priceReplacement: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creando...' : 'Crear Producto'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
