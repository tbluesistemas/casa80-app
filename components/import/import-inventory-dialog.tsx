'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { parseInventoryExcel } from '@/lib/excel-import'
import { importInventoryFromExcel } from '@/lib/actions'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ImportInventoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function ImportInventoryDialog({ open, onOpenChange, onSuccess }: ImportInventoryDialogProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<{
        success: boolean
        message?: string
        errors?: string[]
    } | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            // Validar que sea un archivo Excel
            const validTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ]
            if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
                alert('Por favor selecciona un archivo Excel válido (.xlsx o .xls)')
                return
            }
            setFile(selectedFile)
            setResult(null)
        }
    }

    const handleImport = async () => {
        if (!file) return

        setIsProcessing(true)
        setResult(null)

        try {
            // Parsear el archivo Excel
            const parseResult = await parseInventoryExcel(file)

            if (!parseResult.success || !parseResult.data) {
                setResult({
                    success: false,
                    errors: parseResult.errors
                })
                setIsProcessing(false)
                return
            }

            // Importar los productos
            const importResult = await importInventoryFromExcel(parseResult.data)

            if (importResult.success) {
                setResult({
                    success: true,
                    message: importResult.message
                })

                // Limpiar el archivo
                setFile(null)

                // Llamar callback de éxito
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess()
                        onOpenChange(false)
                    }, 2000)
                }
            } else {
                setResult({
                    success: false,
                    errors: [importResult.error || 'Error al importar']
                })
            }
        } catch (error) {
            console.error('Import error:', error)
            setResult({
                success: false,
                errors: ['Error inesperado al importar el archivo']
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleClose = () => {
        setFile(null)
        setResult(null)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Importar Inventario desde Excel</DialogTitle>
                    <DialogDescription>
                        Sube un archivo Excel con los productos a importar
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Instrucciones */}
                    <Alert>
                        <AlertDescription className="text-sm">
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Descarga la plantilla de Excel</li>
                                <li>Llena los datos de tus productos</li>
                                <li>Sube el archivo completado</li>
                            </ol>
                        </AlertDescription>
                    </Alert>

                    {/* Selector de archivo */}
                    <div className="space-y-2">
                        <Label htmlFor="file">Archivo Excel</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            disabled={isProcessing}
                        />
                        {file && (
                            <p className="text-sm text-muted-foreground">
                                Archivo seleccionado: {file.name}
                            </p>
                        )}
                    </div>

                    {/* Resultado */}
                    {result && (
                        <Alert variant={result.success ? 'default' : 'destructive'}>
                            {result.success ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <AlertCircle className="h-4 w-4" />
                            )}
                            <AlertDescription>
                                {result.success ? (
                                    <p>{result.message}</p>
                                ) : (
                                    <div>
                                        <p className="font-semibold mb-2">Errores encontrados:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {result.errors?.map((error, index) => (
                                                <li key={index} className="text-sm">{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isProcessing}
                    >
                        Cerrar
                    </Button>

                    <Button
                        onClick={handleImport}
                        disabled={!file || isProcessing}
                    >
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Upload className="mr-2 h-4 w-4" />
                        Importar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
