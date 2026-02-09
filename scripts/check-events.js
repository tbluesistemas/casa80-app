
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
    })
    console.log('Events found:', events.length)
    events.forEach(event => {
        console.log(`Event: ${event.name} (${event.id})`)
        console.log(`  Start: ${event.startDate.toISOString()}`)
        console.log(`  End: ${event.endDate.toISOString()}`)
        console.log(`  Status: ${event.status}`)
        console.log(`  Now: ${new Date().toISOString()}`)
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
