import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting to database...')
        const users = await prisma.user.count()
        console.log(`Successfully connected! Found ${users} users.`)

        const products = await prisma.product.count()
        console.log(`Found ${products} products.`)

        const events = await prisma.event.count()
        console.log(`Found ${events} events.`)

    } catch (e) {
        console.error('Error connecting to database:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
