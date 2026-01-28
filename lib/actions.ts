'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendReservationEmail } from '@/lib/email'

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

export async function updateProduct(id: string, data: {
    name?: string
    category?: string | null
    description?: string | null
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
        console.error('Error updating product:', error)
        return { success: false, error: 'Error al actualizar producto' }
    }
}

export async function createProduct(data: {
    name: string
    category?: string
    description?: string
    totalQuantity?: number
    priceUnit?: number
    priceReplacement?: number
}) {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                category: data.category || null,
                description: data.description || null,
                totalQuantity: data.totalQuantity || 0,
                priceUnit: data.priceUnit || 0,
                priceReplacement: data.priceReplacement || 0,
            }
        })
        revalidatePath('/inventory')
        return { success: true, data: product }
    } catch (error) {
        console.error('Error creating product:', error)
        return { success: false, error: 'Error al crear producto' }
    }
}

export async function updateEvent(id: string, data: {
    name?: string
    startDate?: Date
    endDate?: Date
    status?: string
    notes?: string
}) {
    try {
        const event = await prisma.event.update({
            where: { id },
            data
        })
        revalidatePath('/events')
        revalidatePath(`/events/${id}`)
        return { success: true, data: event }
    } catch (error) {
        console.error('Error updating event:', error)
        return { success: false, error: 'Error al actualizar evento' }
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
    clientId?: string
    notes?: string
    items: CreateEventItem[]
}) {
    const { name, startDate, endDate, items, clientId } = data

    if (!items || items.length === 0) {
        return { success: false, error: 'No se seleccionaron productos' }
    }

    try {
        // Validate dates
        if (data.endDate < data.startDate) {
            return { success: false, error: 'La fecha de fin no puede ser anterior a la de inicio' }
        }

        // 1. Check availability
        // Find all active/booked events that overlap with the requested dates
        const overlappingEvents = await prisma.event.findMany({
            where: {
                status: { in: ['BOOKED', 'ACTIVE'] },
                OR: [
                    {
                        startDate: { lte: data.endDate },
                        endDate: { gte: data.startDate },
                    },
                ],
            },
            include: {
                items: true,
            },
        })

        // Calculate usage for each product in the requested items
        for (const item of data.items) {
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
        const event = await prisma.event.create({
            data: {
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                notes: data.notes,
                clientId: clientId, // Optional link
                status: 'BOOKED',
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                items: {
                    include: { product: true }
                }
            }
        })

        // Email Notification (Fire and forget, don't block response)
        const sendEmailPromise = async () => {
            try {
                let clientEmail = null
                let clientName = data.name

                if (clientId) {
                    const client = await prisma.client.findUnique({ where: { id: clientId } })
                    if (client && client.email) {
                        clientEmail = client.email
                        clientName = client.name
                    }
                }

                if (clientEmail) {
                    await sendReservationEmail(
                        clientEmail,
                        clientName,
                        {
                            id: event.id,
                            name: event.name,
                            startDate: event.startDate,
                            endDate: event.endDate,
                            totalItems: event.items.reduce((acc, item) => acc + item.quantity, 0)
                        },
                        event.items.map(item => ({
                            productName: item.product.name,
                            quantity: item.quantity
                        }))
                    )
                }
            } catch (emailError) {
                console.error('Failed to send email async:', emailError)
            }
        }
        sendEmailPromise()

        revalidatePath('/inventory')
        revalidatePath('/events')
        return { success: true, data: event }
    } catch (error) {
        console.error('Error creating event:', error)
        return { success: false, error: 'Error al crear el evento' }
    }
}

export async function getInventoryLogs(productId: string) {
    try {
        const logs = await prisma.inventoryLog.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            include: { product: true }
        })
        return { success: true, data: logs }
    } catch (error) {
        return { success: false, error: 'Error fetching history' }
    }
}

export async function getClients(query: string) {
    try {
        const clients = await prisma.client.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { document: { contains: query } },
                    { email: { contains: query } },
                    { phone: { contains: query } }
                ]
            },
            take: 5,
            orderBy: { name: 'asc' },
        })
        return { success: true, data: clients }
    } catch (error) {
        console.error('Error fetching clients:', error)
        return { success: false, error: 'Error al buscar clientes' }
    }
}

export async function createClient(data: {
    name: string
    document?: string
    email?: string
    phone?: string
    department?: string
    city?: string
    neighborhood?: string
    address?: string
    notes?: string
}) {
    try {
        const client = await prisma.client.create({
            data: {
                name: data.name,
                document: data.document,
                email: data.email,
                phone: data.phone,
                department: data.department,
                city: data.city,
                neighborhood: data.neighborhood,
                address: data.address,
                notes: data.notes
            }
        })
        return { success: true, data: client }
    } catch (error) {
        console.error('Error creating client:', error)
        // Log explicitly if prisma.client is likely missing
        if ((error as any).toString().includes('undefined')) {
            console.error('Prisma Client model might be missing. Restart server required.')
        }
        return { success: false, error: error instanceof Error ? error.message : 'Error al crear cliente' }
    }
}

export type ReturnItem = {
    productId: string
    returnedGood: number
    returnedDamaged: number
}

export async function registerReturn(eventId: string, items: ReturnItem[]) {
    console.log(`[registerReturn] Starting for eventId: ${eventId}, items: ${items.length}`)
    try {
        let totalDamageCost = 0

        // Update each item in the event
        for (const item of items) {
            console.log(`[registerReturn] Processing item: ${item.productId}, Good: ${item.returnedGood}, Damaged: ${item.returnedDamaged}`)
            // Get product for price info
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            })

            if (!product) {
                console.error(`[registerReturn] Product not found: ${item.productId}`)
                continue
            }

            // Calculate cost
            if (item.returnedDamaged > 0) {
                totalDamageCost += item.returnedDamaged * product.priceReplacement
            }

            // Update EventItem
            const updateResult = await prisma.eventItem.updateMany({
                where: {
                    eventId: eventId,
                    productId: item.productId,
                },
                data: {
                    returnedGood: item.returnedGood,
                    returnedDamaged: item.returnedDamaged,
                },
            })
            console.log(`[registerReturn] Update result for ${item.productId}: ${updateResult.count} records updated`)
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
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido al registrar la devolución' }
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
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido al obtener el evento' }
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

export async function getDashboardStats() {
    try {
        const now = new Date()

        // 1. Active Reservations (Booked or Active)
        const activeReservations = await prisma.event.count({
            where: {
                status: { in: ['BOOKED', 'ACTIVE'] }
            }
        })

        // 2. Total Inventory && Inventory Value
        const products = await prisma.product.findMany({
            select: { totalQuantity: true, priceReplacement: true }
        })
        const totalInventory = products.reduce((acc, curr) => acc + curr.totalQuantity, 0)
        const inventoryValue = products.reduce((acc, curr) => acc + (curr.totalQuantity * curr.priceReplacement), 0)

        // 3. Pending Returns (EndDate passed + Not Completed)
        const pendingReturns = await prisma.event.count({
            where: {
                endDate: { lte: now },
                status: { not: 'COMPLETED' }
            }
        })

        // 4. Upcoming Events
        const recentEvents = await prisma.event.findMany({
            take: 5,
            orderBy: { startDate: 'asc' },
            where: {
                status: { not: 'CANCELLED' },
                startDate: { gte: now } // Only future events
            }
        })

        return {
            success: true,
            data: {
                activeReservations,
                totalInventory,
                inventoryValue,
                pendingReturns,
                recentEvents
            }
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return { success: false, error: 'Error al cargar estadísticas' }
    }
}
