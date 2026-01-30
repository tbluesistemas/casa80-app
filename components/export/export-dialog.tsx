'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Download, Loader2 } from 'lucide-react'

interface ExportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    onExport: (startDate?: Date, endDate?: Date) => Promise<void>
    requiresDates?: boolean
}

export function ExportDialog({
    open,
    onOpenChange,
    title,
    description,
    onExport,
    requiresDates = true
}: ExportDialogProps) {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const start = startDate ? new Date(startDate) : undefined
            const end = endDate ? new Date(endDate) : undefined
            await onExport(start, end)
            onOpenChange(false)
            // Reset dates
            setStartDate('')
            setEndDate('')
        } catch (error) {
            console.error('Error exporting:', error)
            alert('Error al exportar. Por favor intenta de nuevo.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                {requiresDates && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Fecha Inicio (Opcional)</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">Fecha Fin (Opcional)</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Si no seleccionas fechas, se exportarán todos los registros.
                        </p>
                    </div>
                )}

                {!requiresDates && (
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Se exportará el estado actual del inventario.
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
                        Cancelar
                    </Button>
                    <Button onClick={handleExport} disabled={isExporting}>
                        {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Download className="mr-2 h-4 w-4" />
                        Exportar a Excel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
