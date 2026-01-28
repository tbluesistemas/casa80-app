'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Add to lib/actions.ts

export async function updateProduct(id: string, data: {
    name?: string
    category?: string
    description?: string
    totalQuantity?: number
    priceUnit?: number
    priceReplacement?: number
}) {
    try {
        const product = await prisma.product.update({
            where: { id },
            data
        })
        revalidatePath('/inventory')
        return { success: true, data: product }
    } catch (error) {
        return { success: false, error: 'Error al actualizar producto' }
    }
}
