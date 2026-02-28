/**
 * Script para limpiar todos los datos de la base de datos
 * EXCEPTO los usuarios (tabla User).
 *
 * Uso: node scripts/clear-data.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function clearData() {
    console.log('🚨 Iniciando limpieza de datos...\n')

    try {
        // El orden importa para respetar las relaciones (FK constraints)
        // Primero eliminamos los hijos antes que los padres

        console.log('🗑️  Eliminando historial de eventos...')
        const deletedHistory = await prisma.eventHistory.deleteMany({})
        console.log(`   ✅ ${deletedHistory.count} registros eliminados\n`)

        console.log('🗑️  Eliminando ítems de eventos...')
        const deletedEventItems = await prisma.eventItem.deleteMany({})
        console.log(`   ✅ ${deletedEventItems.count} registros eliminados\n`)

        console.log('🗑️  Eliminando eventos...')
        const deletedEvents = await prisma.event.deleteMany({})
        console.log(`   ✅ ${deletedEvents.count} registros eliminados\n`)

        console.log('🗑️  Eliminando logs de inventario...')
        const deletedLogs = await prisma.inventoryLog.deleteMany({})
        console.log(`   ✅ ${deletedLogs.count} registros eliminados\n`)

        console.log('🗑️  Eliminando productos...')
        const deletedProducts = await prisma.product.deleteMany({})
        console.log(`   ✅ ${deletedProducts.count} registros eliminados\n`)

        console.log('🗑️  Eliminando clientes...')
        const deletedClients = await prisma.client.deleteMany({})
        console.log(`   ✅ ${deletedClients.count} registros eliminados\n`)

        // Verificar que los usuarios siguen intactos
        const userCount = await prisma.user.count()
        console.log(`✅ Usuarios conservados: ${userCount}`)
        console.log('\n🎉 Limpieza completada. La base de datos está lista para datos reales.')

    } catch (error) {
        console.error('\n❌ Error durante la limpieza:', error.message)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

clearData()
