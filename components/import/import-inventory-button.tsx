'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Download } from 'lucide-react'
import { ImportInventoryDialog } from './import-inventory-dialog'
import { generateInventoryTemplate } from '@/lib/excel-import'

interface ImportInventoryButtonProps {
    onImportSuccess?: () => void
}

export function ImportInventoryButton({ onImportSuccess }: ImportInventoryButtonProps) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDownloadTemplate = () => {
        generateInventoryTemplate()
    }

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                title="Descargar plantilla de Excel"
            >
                <Download className="mr-2 h-4 w-4" />
                Plantilla
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(true)}
            >
                <Upload className="mr-2 h-4 w-4" />
                Importar
            </Button>

            <ImportInventoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSuccess={onImportSuccess}
            />
        </div>
    )
}
