import { Badge } from "@/components/ui/badge"
import { EVENT_STATUS_LABELS, EVENT_STATUS_COLORS, EventStatus } from "@/lib/event-status"
import { cn } from "@/lib/utils"

interface EventStatusBadgeProps {
    status: EventStatus
    className?: string
}

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
    const color = EVENT_STATUS_COLORS[status]
    const label = EVENT_STATUS_LABELS[status]

    const colorClasses: Record<string, string> = {
        yellow: 'bg-yellow-500/10 text-yellow-700 border-yellow-600/20 dark:text-yellow-500',
        blue: 'bg-blue-500/10 text-blue-700 border-blue-600/20 dark:text-blue-400',
        orange: 'bg-orange-500/10 text-orange-700 border-orange-600/20 dark:text-orange-400',
        green: 'bg-green-500/10 text-green-700 border-green-600/20 dark:text-green-400',
        red: 'bg-red-500/10 text-red-700 border-red-600/20 dark:text-red-400'
    }

    return (
        <Badge
            variant="outline"
            className={cn(colorClasses[color], className)}
        >
            {label}
        </Badge>
    )
}
