'use client'

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Hide sidebar on standard full-screen pages like login
    const isPublicPage = pathname === "/login";

    if (isPublicPage) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background flex-col md:flex-row overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center h-14 sm:h-16 border-b px-3 sm:px-4 gap-3 sm:gap-4 shrink-0 bg-background z-40">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="-ml-1">
                            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[280px] sm:w-64">
                        <Sidebar onLinkClick={() => setOpen(false)} className="border-none w-full shadow-none" />
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2 min-w-0">
                    <img src="/logo.png" alt="Casa80 Logo" className="h-8 sm:h-10 w-auto object-contain shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <div className="font-bold text-sm sm:text-base leading-none">Casa80</div>
                        <div className="text-[7px] text-muted-foreground font-medium uppercase tracking-tight truncate">
                            El ALIADO perfecto para tus eventos!
                        </div>
                    </div>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-64 border-r bg-background fixed inset-y-0 z-30">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background md:pl-64 min-w-0">
                {children}
            </main>
        </div>
    );
}
