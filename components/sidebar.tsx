'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarDays, Home, Package, PlusCircle } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Inicio", icon: Home },
        { href: "/events", label: "Reservas", icon: CalendarDays },
        { href: "/inventory", label: "Inventario", icon: Package },
    ];

    return (
        <div className="flex h-full w-64 flex-col border-r bg-background">
            <div className="flex h-16 items-center px-6 font-bold text-xl border-b">
                Casa80
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-4 flex gap-2">
                <Link href="/events/new" className="flex-1">
                    <Button className="w-full justify-start gap-2" variant="default">
                        <PlusCircle className="h-4 w-4" />
                        Nueva Reserva
                    </Button>
                </Link>
            </div>
        </div>
    );
}
