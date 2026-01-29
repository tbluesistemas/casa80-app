import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return NextResponse.json({ success: false, error: "User not found" })

        // Cast to any because of the EPERM types issue
        const userAny = user as any;

        if (!userAny.password) return NextResponse.json({ success: false, error: "User has no password" })

        const match = await bcrypt.compare(password, userAny.password)

        return NextResponse.json({
            success: true,
            match,
            role: user.role,
            storedHash: userAny.password.substring(0, 10) + "..."
        })
    } catch (e) {
        return NextResponse.json({ success: false, error: String(e) })
    }
}
