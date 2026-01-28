"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null // Avoid hydration mismatch
    }

    const isDark = theme === "dark"

    return (
        <div
            className={cn(
                "relative flex h-9 w-28 cursor-pointer items-center rounded-full px-1 shadow-2xl transition-colors duration-500 border-2",
                isDark ? "bg-black border-white" : "bg-gray-200 border-gray-800"
            )}
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {/* Icon Thumb */}
            <div
                className={cn(
                    "absolute flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 ease-in-out",
                    isDark ? "translate-x-0" : "translate-x-[4.5rem]"
                )}
            >
                {isDark ? (
                    <div className="relative">
                        <Moon className="h-3.5 w-3.5 text-black" fill="transparent" />
                    </div>
                ) : (
                    <Sun className="h-3.5 w-3.5 text-black" />
                )}
            </div>

            {/* Text Labels */}
            <span
                className={cn(
                    "absolute font-bold text-[9px] tracking-wider transition-opacity duration-300",
                    isDark ? "right-2 text-white opacity-100" : "right-2 opacity-0"
                )}
            >
                NIGHT MODE
            </span>

            <span
                className={cn(
                    "absolute font-bold text-[9px] tracking-wider transition-opacity duration-300",
                    !isDark ? "left-2 text-black opacity-100" : "left-2 opacity-0"
                )}
            >
                DAY MODE
            </span>
        </div>
    )
}
