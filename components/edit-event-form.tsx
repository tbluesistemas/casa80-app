'use client'

import { useState } from 'react'
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

interface EditEventFormProps {
    event: {
        id: string
        name: string
        startDate: Date
        endDate: Date
        status: string
        notes?: string | null
    }
}

export function EditEventForm({ event }: EditEventFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: event.name,
        startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(event.endDate), 'yyyy-MM-dd'),
        status: event.status,
        notes: event.notes || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await updateEvent(event.id, {
            name: formData.name,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            status: formData.status,
            notes: formData.notes || undefined,
        })

        if (result.success) {
            toast.success('Reserva actualizada correctamente')
            router.push('/events')
        } else {
            toast.error(result.error)
        }
        setLoading(false)
    }

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

                    <div className="grid gap-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BOOKED">Reservado</SelectItem>
                                <SelectItem value="ACTIVE">En Curso</SelectItem>
                                <SelectItem value="COMPLETED">Completado</SelectItem>
                                <SelectItem value="CANCELLED">Cancelado</SelectItem>
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
