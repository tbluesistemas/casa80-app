'use client'

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    if (isHomePage) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                {children}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}
