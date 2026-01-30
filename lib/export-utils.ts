export function formatDateForExcel(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date))
}

export function formatCurrencyForExcel(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(amount)
}

export function getCurrentDateForFilename(): string {
    const now = new Date()
    return now.toISOString().split('T')[0] // YYYY-MM-DD
}
