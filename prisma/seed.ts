import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando seed...')

    // Limpiar base de datos (opcional, cuidado en prod)
    // await prisma.eventItem.deleteMany()
    // await prisma.event.deleteMany()
    // await prisma.product.deleteMany()
    // await prisma.user.deleteMany()

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

    console.log({ silla, mesa, mantel })
    console.log('Seed completado.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
