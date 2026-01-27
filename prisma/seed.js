require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

async function main() {
    console.log('Iniciando seed (JS)...')

    try {
        const existing = await prisma.product.count()
        if (existing > 0) {
            console.log('Seed omitido: La base de datos ya tiene productos.')
            return
        }

        // Crear productos
        const silla = await prisma.product.create({
            data: {
                name: 'Silla Tiffany Dorada',
                description: 'Silla elegante para eventos formales, color dorado',
                totalQuantity: 100,
                priceReplacement: 150.00,
                imageUrl: '/images/silla-tiffany.jpg',
            },
        })

        const mesa = await prisma.product.create({
            data: {
                name: 'Mesa Redonda 10 personas',
                description: 'Mesa plegable de madera, 1.5m de diámetro',
                totalQuantity: 20,
                priceReplacement: 800.00,
                imageUrl: '/images/mesa-redonda.jpg',
            },
        })

        const mantel = await prisma.product.create({
            data: {
                name: 'Mantel Blanco Premium',
                description: 'Mantel de tela gruesa, resistente a manchas',
                totalQuantity: 50,
                priceReplacement: 200.00,
                imageUrl: '/images/mantel-blanco.jpg',
            },
        })

        console.log('Seed completado:', { silla, mesa, mantel })
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
