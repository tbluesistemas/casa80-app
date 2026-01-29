import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateProductPrices() {
    try {
        // Update Silla Tiffany Dorada
        await prisma.product.updateMany({
            where: { name: 'Silla Tiffany Dorada' },
            data: { priceUnit: 30.00 }
        })

        // Update Mesa Redonda 10 personas
        await prisma.product.updateMany({
            where: { name: 'Mesa Redonda 10 personas' },
            data: { priceUnit: 200.00 }
        })

        // Update Mantel Blanco Premium
        await prisma.product.updateMany({
            where: { name: 'Mantel Blanco Premium' },
            data: { priceUnit: 50.00 }
        })

        console.log('✅ Precios actualizados correctamente!')
        console.log('   - Silla Tiffany Dorada: $30')
        console.log('   - Mesa Redonda 10 personas: $200')
        console.log('   - Mantel Blanco Premium: $50')
    } catch (error) {
        console.error('❌ Error actualizando precios:', error)
    } finally {
        await prisma.$disconnect()
    }
}

updateProductPrices()
