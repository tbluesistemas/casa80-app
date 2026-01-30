import * as XLSX from 'xlsx'
import { getCurrentDateForFilename } from './export-utils'

export function generateInventoryTemplate() {
    // Datos de ejemplo para la plantilla
    const templateData = [
        {
            'Nombre del Producto': 'Silla Tiffany Blanca',
            'Categoría': 'Mobiliario',
            'Descripción': 'Silla elegante para eventos formales',
            'Cantidad Total': 50,
            'Precio Unitario': 25.00,
            'Precio de Daño': 150.00
        },
        {
            'Nombre del Producto': 'Mesa Rectangular 8 personas',
            'Categoría': 'Mobiliario',
            'Descripción': 'Mesa plegable de madera, 2m x 0.8m',
            'Cantidad Total': 15,
            'Precio Unitario': 50.00,
            'Precio de Daño': 800.00
        },
        {
            'Nombre del Producto': '',
            'Categoría': '',
            'Descripción': '',
            'Cantidad Total': 0,
            'Precio Unitario': 0,
            'Precio de Daño': 0
        }
    ]

    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla Inventario')

    // Configurar ancho de columnas
    const colWidths = [
        { wch: 35 }, // Nombre del Producto
        { wch: 20 }, // Categoría
        { wch: 40 }, // Descripción
        { wch: 15 }, // Cantidad Total
        { wch: 18 }, // Precio Unitario
        { wch: 18 }, // Precio de Daño
    ]
    ws['!cols'] = colWidths

    // Agregar hoja de instrucciones
    const instructions = [
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '1. Llena la hoja "Plantilla Inventario" con tus productos' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '2. NO modifiques los nombres de las columnas' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '3. Campos OBLIGATORIOS:' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '   - Nombre del Producto' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '   - Cantidad Total (número entero mayor a 0)' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '   - Precio Unitario (número decimal)' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '   - Precio de Daño (número decimal)' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '4. Campos OPCIONALES:' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '   - Categoría' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '   - Descripción' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '5. Elimina las filas de ejemplo antes de importar' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '6. Guarda el archivo y súbelo en la opción "Importar"' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': '' },
        { 'INSTRUCCIONES PARA IMPORTAR INVENTARIO': 'NOTA: Si un producto ya existe (mismo nombre), se actualizará' },
    ]

    const wsInstructions = XLSX.utils.json_to_sheet(instructions)
    wsInstructions['!cols'] = [{ wch: 60 }]
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instrucciones')

    const filename = `plantilla_inventario_${getCurrentDateForFilename()}.xlsx`
    XLSX.writeFile(wb, filename)
}

export interface ImportedProduct {
    name: string
    category?: string
    description?: string
    totalQuantity: number
    priceUnit: number
    priceReplacement: number
}

export interface ImportResult {
    success: boolean
    data?: ImportedProduct[]
    errors?: string[]
}

export function parseInventoryExcel(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array' })

                // Buscar la hoja de plantilla
                const sheetName = workbook.SheetNames.find(name =>
                    name.includes('Plantilla') || name.includes('Inventario')
                ) || workbook.SheetNames[0]

                const worksheet = workbook.Sheets[sheetName]
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

                const products: ImportedProduct[] = []
                const errors: string[] = []

                jsonData.forEach((row, index) => {
                    const rowNum = index + 2 // +2 porque Excel empieza en 1 y hay header

                    // Validar campos obligatorios
                    const name = row['Nombre del Producto']?.toString().trim()
                    if (!name) {
                        errors.push(`Fila ${rowNum}: Falta el nombre del producto`)
                        return
                    }

                    const totalQuantity = parseInt(row['Cantidad Total'])
                    if (isNaN(totalQuantity) || totalQuantity <= 0) {
                        errors.push(`Fila ${rowNum}: Cantidad Total debe ser un número mayor a 0`)
                        return
                    }

                    const priceUnit = parseFloat(row['Precio Unitario'])
                    if (isNaN(priceUnit) || priceUnit < 0) {
                        errors.push(`Fila ${rowNum}: Precio Unitario debe ser un número válido`)
                        return
                    }

                    const priceReplacement = parseFloat(row['Precio de Daño'])
                    if (isNaN(priceReplacement) || priceReplacement < 0) {
                        errors.push(`Fila ${rowNum}: Precio de Daño debe ser un número válido`)
                        return
                    }

                    // Crear objeto de producto
                    const product: ImportedProduct = {
                        name,
                        totalQuantity,
                        priceUnit,
                        priceReplacement,
                        category: row['Categoría']?.toString().trim() || undefined,
                        description: row['Descripción']?.toString().trim() || undefined,
                    }

                    products.push(product)
                })

                if (errors.length > 0) {
                    resolve({ success: false, errors })
                } else if (products.length === 0) {
                    resolve({ success: false, errors: ['No se encontraron productos válidos en el archivo'] })
                } else {
                    resolve({ success: true, data: products })
                }
            } catch (error) {
                resolve({
                    success: false,
                    errors: ['Error al leer el archivo. Asegúrate de que sea un archivo Excel válido.']
                })
            }
        }

        reader.onerror = () => {
            resolve({
                success: false,
                errors: ['Error al leer el archivo']
            })
        }

        reader.readAsArrayBuffer(file)
    })
}
