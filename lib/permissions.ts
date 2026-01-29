/**
 * Utility functions for handling user permissions and data masking
 */

export type UserRole = 'ADMIN' | 'VIEWER'

/**
 * Masks sensitive phone numbers for VIEWER users
 * Example: "3001234567" becomes "3*******67"
 */
export function maskPhone(phone: string | null | undefined, userRole: UserRole): string {
    if (!phone) return ''
    if (userRole === 'ADMIN') return phone

    if (phone.length <= 4) return phone
    const firstTwo = phone.substring(0, 1)
    const lastTwo = phone.substring(phone.length - 2)
    const masked = '*'.repeat(Math.max(phone.length - 3, 1))
    return `${firstTwo}${masked}${lastTwo}`
}

/**
 * Masks sensitive email addresses for VIEWER users
 * Example: "usuario@ejemplo.com" becomes "us*****@ejemplo.com"
 */
export function maskEmail(email: string | null | undefined, userRole: UserRole): string {
    if (!email) return ''
    if (userRole === 'ADMIN') return email

    const [localPart, domain] = email.split('@')
    if (!domain) return email

    if (localPart.length <= 2) return email
    const visibleStart = localPart.substring(0, 2)
    const masked = '*'.repeat(Math.min(localPart.length - 2, 5))
    return `${visibleStart}${masked}@${domain}`
}

/**
 * Masks sensitive document numbers for VIEWER users
 * Example: "1234567890" becomes "12*****90"
 */
export function maskDocument(document: string | null | undefined, userRole: UserRole): string {
    if (!document) return ''
    if (userRole === 'ADMIN') return document

    if (document.length <= 4) return document
    const firstTwo = document.substring(0, 2)
    const lastTwo = document.substring(document.length - 2)
    const masked = '*'.repeat(Math.max(document.length - 4, 1))
    return `${firstTwo}${masked}${lastTwo}`
}

/**
 * Masks sensitive address information for VIEWER users
 */
export function maskAddress(address: string | null | undefined, userRole: UserRole): string {
    if (!address) return ''
    if (userRole === 'ADMIN') return address

    // For addresses, just show the general area (first 10 chars)
    if (address.length <= 10) return address
    return `${address.substring(0, 10)}...`
}

/**
 * Check if user can edit data
 */
export function canEdit(userRole: UserRole): boolean {
    return userRole === 'ADMIN'
}

/**
 * Check if user can view sensitive data
 */
export function canViewSensitiveData(userRole: UserRole): boolean {
    return userRole === 'ADMIN'
}
