import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando seed...')

    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@casa80.com' },
        update: {},
        create: {
            email: 'admin@casa80.com',
            name: 'Administrador',
            password: hashedPassword,
            role: 'ADMIN',
            active: true
        }
    })

    // Crear productos
    const silla = await prisma.product.upsert({
        where: { id: 'seed-silla-tiffany' },
        update: {},
        create: {
            id: 'seed-silla-tiffany',
            name: 'Silla Tiffany Dorada',
            description: 'Silla elegante para eventos formales, color dorado',
            totalQuantity: 100,
            priceReplacement: 150.00,
            imageUrl: '/images/silla-tiffany.jpg',
        },
    })

    const mesa = await prisma.product.upsert({
        where: { id: 'seed-mesa-redonda' },
        update: {},
        create: {
            id: 'seed-mesa-redonda',
            name: 'Mesa Redonda 10 personas',
            description: 'Mesa plegable de madera, 1.5m de diámetro',
            totalQuantity: 20,
            priceReplacement: 800.00,
            imageUrl: '/images/mesa-redonda.jpg',
        },
    })

    const mantel = await prisma.product.upsert({
        where: { id: 'seed-mantel-blanco' },
        update: {},
        create: {
            id: 'seed-mantel-blanco',
            name: 'Mantel Blanco Premium',
            description: 'Mantel de tela gruesa, resistente a manchas',
            totalQuantity: 50,
            priceReplacement: 200.00,
            imageUrl: '/images/mantel-blanco.jpg',
        },
    })

    // Crear clientes de ejemplo
    const cliente1 = await prisma.client.upsert({
        where: { id: 'seed-client-1' },
        update: {},
        create: {
            id: 'seed-client-1',
            name: 'María García',
            document: '12345678',
            email: 'maria.garcia@example.com',
            phone: '3001234567',
            department: 'Atlántico',
            city: 'Barranquilla',
            neighborhood: 'El Prado',
            address: 'Calle 72 #45-23',
            notes: 'Cliente frecuente'
        }
    })

    const cliente2 = await prisma.client.upsert({
        where: { id: 'seed-client-2' },
        update: {},
        create: {
            id: 'seed-client-2',
            name: 'Carlos Rodríguez',
            document: '87654321',
            email: 'carlos.rodriguez@example.com',
            phone: '3009876543',
            department: 'Atlántico',
            city: 'Barranquilla',
            neighborhood: 'Riomar',
            address: 'Carrera 51B #85-45',
        }
    })

    const cliente3 = await prisma.client.upsert({
        where: { id: 'seed-client-3' },
        update: {},
        create: {
            id: 'seed-client-3',
            name: 'Ana Martínez',
            document: '11223344',
            email: 'ana.martinez@example.com',
            phone: '3005551234',
            department: 'Atlántico',
            city: 'Barranquilla',
            neighborhood: 'Alto Prado',
            address: 'Calle 98 #52-10',
        }
    })

    console.log('✅ Usuario administrador:', admin.email)
    console.log('✅ Productos creados:', { silla: silla.name, mesa: mesa.name, mantel: mantel.name })
    console.log('✅ Clientes creados:', {
        cliente1: cliente1.name,
        cliente2: cliente2.name,
        cliente3: cliente3.name
    })
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
