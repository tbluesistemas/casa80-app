import { seedDatabase } from '@/lib/actions'
import { NextResponse } from 'next/server'

export async function GET() {
    const res = await seedDatabase()
    return NextResponse.json(res)
}
