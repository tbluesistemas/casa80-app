'use server'

import { prisma } from '@/lib/prisma'

// ==================== Client Actions ====================

export async function getAllClientsWithStats() {
    try {
        const clients = await prisma.client.findMany({
            include: {
                events: {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    },
                    orderBy: {
                        startDate: 'desc'
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        // Calculate stats for each client
        const clientsWithStats = clients.map((client) => {
            const totalEvents = client.events.length
            const activeEvents = client.events.filter((e) =>
                ['SIN_CONFIRMAR', 'RESERVADO', 'DESPACHADO'].includes(e.status)
            ).length
            const completedEvents = client.events.filter((e) => e.status === 'COMPLETADO').length

            const totalSpent = client.events.reduce((acc: number, event) => {
                const eventTotal = event.items.reduce((sum: number, item) =>
                    sum + (item.quantity * item.product.priceUnit), 0
                )
                return acc + eventTotal
            }, 0)

            return {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address,
                createdAt: client.createdAt,
                stats: {
                    totalEvents,
                    activeEvents,
                    completedEvents,
                    totalSpent
                }
            }
        })

        return { success: true, data: clientsWithStats }
    } catch (error) {
        console.error('Error fetching clients:', error)
        return { success: false, error: 'Error al obtener clientes' }
    }
}

export async function getClientById(id: string) {
    try {
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                events: {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    },
                    orderBy: {
                        startDate: 'desc'
                    }
                }
            }
        })

        if (!client) {
            return { success: false, error: 'Cliente no encontrado' }
        }

        // Calculate stats
        const totalEvents = client.events.length
        const activeEvents = client.events.filter((e) =>
            ['SIN_CONFIRMAR', 'RESERVADO', 'DESPACHADO'].includes(e.status)
        ).length
        const completedEvents = client.events.filter((e) => e.status === 'COMPLETADO').length

        const totalSpent = client.events.reduce((acc: number, event) => {
            const eventTotal = event.items.reduce((sum: number, item) =>
                sum + (item.quantity * item.product.priceUnit), 0
            )
            return acc + eventTotal
        }, 0)

        return {
            success: true,
            data: {
                ...client,
                stats: {
                    totalEvents,
                    activeEvents,
                    completedEvents,
                    totalSpent
                }
            }
        }
    } catch (error) {
        console.error('Error fetching client:', error)
        return { success: false, error: 'Error al obtener cliente' }
    }
}
