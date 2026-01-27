'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' },
        })
        return { success: true, data: products }
    } catch (error) {
        console.error('Error fetching products:', error)
        return { success: false, error: 'Error al obtener productos' }
    }
}

export type CreateEventItem = {
    productId: string
    quantity: number
}

export async function createEvent(data: {
    name: string
    startDate: Date
    endDate: Date
    items: CreateEventItem[]
}) {
    const { name, startDate, endDate, items } = data

    if (!items || items.length === 0) {
        return { success: false, error: 'No se seleccionaron productos' }
    }

    try {
        // 1. Check availability
        // Find all active/booked events that overlap with the requested dates
        const overlappingEvents = await prisma.event.findMany({
            where: {
                status: { in: ['BOOKED', 'ACTIVE'] },
                OR: [
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate },
                    },
                ],
            },
            include: {
                items: true,
            },
        })

        // Calculate usage for each product in the requested items
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            })

            if (!product) {
                return { success: false, error: `Producto no encontrado: ${item.productId}` }
            }

            let usedQuantity = 0
            for (const event of overlappingEvents) {
                const eventItem = event.items.find((ei: any) => ei.productId === item.productId)
                if (eventItem) {
                    usedQuantity += eventItem.quantity
                }
            }

            if (usedQuantity + item.quantity > product.totalQuantity) {
                return {
                    success: false,
                    error: `No hay suficiente stock para "${product.name}". Disponible: ${product.totalQuantity - usedQuantity}, Solicitado: ${item.quantity}`,
                }
            }
        }

        // 2. Create Event
        const newEvent = await prisma.event.create({
            data: {
                name,
                startDate,
                endDate,
                status: 'BOOKED',
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
        })

        revalidatePath('/inventory')
        revalidatePath('/events')
        return { success: true, data: newEvent }
    } catch (error) {
        console.error('Error creating event:', error)
        return { success: false, error: 'Error al crear el evento' }
    }
}

export type ReturnItem = {
    productId: string
    returnedGood: number
    returnedDamaged: number
}

export async function registerReturn(eventId: string, items: ReturnItem[]) {
    try {
        let totalDamageCost = 0

        // Update each item in the event
        for (const item of items) {
            // Get product for price info
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            })

            if (!product) continue

            // Calculate cost
            if (item.returnedDamaged > 0) {
                totalDamageCost += item.returnedDamaged * product.priceReplacement
            }

            // Update EventItem
            await prisma.eventItem.updateMany({
                where: {
                    eventId: eventId,
                    productId: item.productId,
                },
                data: {
                    returnedGood: item.returnedGood,
                    returnedDamaged: item.returnedDamaged,
                },
            })
        }

        // Update event status to COMPLETED
        await prisma.event.update({
            where: { id: eventId },
            data: { status: 'COMPLETED' },
        })

        revalidatePath(`/events/${eventId}`)
        revalidatePath('/events')
        return { success: true, data: { totalDamageCost } }
    } catch (error) {
        console.error('Error registering return:', error)
        return { success: false, error: 'Error al registrar la devolución' }
    }
}

export async function getEvents() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { startDate: 'desc' },
            include: { _count: { select: { items: true } } }
        })
        return { success: true, data: events }
    } catch (error) {
        console.error('Error fetching events:', error)
        return { success: false, error: 'Error al obtener eventos' }
    }
}

export async function getEventById(id: string) {
    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: { items: { include: { product: true } } },
        })
        if (!event) return { success: false, error: 'Evento no encontrado' }
        return { success: true, data: event }
    } catch (error) {
        console.error('Error fetching event:', error)
        return { success: false, error: 'Error al obtener el evento' }
    }
}

export async function seedDatabase() {
    try {
        const existing = await prisma.product.count()
        if (existing > 0) return { success: true, message: 'La base de datos ya tiene productos' }

        await prisma.product.createMany({
            data: [
                {
                    name: 'Silla Tiffany Dorada',
                    description: 'Silla elegante para eventos formales, color dorado',
                    totalQuantity: 100,
                    priceReplacement: 150.00,
                    imageUrl: '/images/silla-tiffany.jpg',
                },
                {
                    name: 'Mesa Redonda 10 personas',
                    description: 'Mesa plegable de madera, 1.5m de diámetro',
                    totalQuantity: 20,
                    priceReplacement: 800.00,
                    imageUrl: '/images/mesa-redonda.jpg',
                },
                {
                    name: 'Mantel Blanco Premium',
                    description: 'Mantel de tela gruesa, resistente a manchas',
                    totalQuantity: 50,
                    priceReplacement: 200.00,
                    imageUrl: '/images/mantel-blanco.jpg',
                },
            ]
        })
        revalidatePath('/inventory')
        return { success: true, message: 'Datos de semilla creados' }
    } catch (error) {
        console.error('Error seeding:', error)
        return { success: false, error: 'Error al crear datos de semilla' }
    }
}
