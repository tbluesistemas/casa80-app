'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { ExportDialog } from './export-dialog'
import {
    getEventsForExport,
    getInventoryForExport,
    getClientsForExport,
    getDamagedProductsForExport
} from '@/lib/actions'
import {
    exportEventsToExcel,
    exportInventoryToExcel,
    exportClientsToExcel,
    exportDamagedProductsToExcel
} from '@/lib/excel-export'

type ExportSegment = 'events' | 'inventory' | 'clients' | 'damages'

interface ExportButtonProps {
    segment: ExportSegment
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const SEGMENT_CONFIG = {
    events: {
        title: 'Exportar Eventos',
        description: 'Selecciona un rango de fechas para exportar los eventos.',
        requiresDates: true,
        action: getEventsForExport,
        export: exportEventsToExcel
    },
    inventory: {
        title: 'Exportar Inventario',
        description: 'Se exportará el estado actual del inventario.',
        requiresDates: false,
        action: getInventoryForExport,
        export: exportInventoryToExcel
    },
    clients: {
        title: 'Exportar Clientes',
        description: 'Se exportarán todos los clientes registrados.',
        requiresDates: false,
        action: getClientsForExport,
        export: exportClientsToExcel
    },
    damages: {
        title: 'Exportar Productos Dañados',
        description: 'Selecciona un rango de fechas para exportar el historial de daños.',
        requiresDates: true,
        action: getDamagedProductsForExport,
        export: exportDamagedProductsToExcel
    }
}

export function ExportButton({ segment, variant = 'outline', size = 'default' }: ExportButtonProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const config = SEGMENT_CONFIG[segment]

    const handleExport = async (startDate?: Date, endDate?: Date) => {
        try {
            // Fetch data
            const result = config.requiresDates
                ? await config.action({ startDate, endDate })
                : await config.action()

            if (!result.success || !result.data) {
                alert(result.error || 'Error al obtener datos')
                return
            }

            // Check if there's data
            if (result.data.length === 0) {
                alert('No hay datos para exportar en el rango seleccionado.')
                return
            }

            // Export to Excel
            config.export(result.data)
        } catch (error) {
            console.error('Export error:', error)
            alert('Error al exportar. Por favor intenta de nuevo.')
        }
    }

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setDialogOpen(true)}
            >
                <Download className="mr-2 h-4 w-4" />
                Exportar
            </Button>

            <ExportDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title={config.title}
                description={config.description}
                onExport={handleExport}
                requiresDates={config.requiresDates}
            />
        </>
    )
}
