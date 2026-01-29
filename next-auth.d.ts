import NextAuth from "next-auth"
import { UserRole } from "@/lib/auth"

declare module "next-auth" {
    interface User {
        role?: UserRole
    }
    interface Session {
        user: {
            role?: UserRole
        } & DefaultSession["user"]
    }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        role?: UserRole
    }
}
