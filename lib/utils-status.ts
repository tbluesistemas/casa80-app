export function getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
        'BOOKED': 'Reservado',
        'ACTIVE': 'En Curso',
        'COMPLETED': 'Completado',
        'CANCELLED': 'Cancelado',
    }
    return statusMap[status] || status
}

export function getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
        'COMPLETED': 'bg-green-100 text-green-800',
        'BOOKED': 'bg-blue-100 text-blue-800',
        'ACTIVE': 'bg-indigo-100 text-indigo-800',
        'CANCELLED': 'bg-red-100 text-red-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
}
