'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EventStatusBadge } from "./event-status-badge"
import { getNextStatuses, EVENT_STATUS_LABELS, EventStatus } from "@/lib/event-status"
import { updateEventStatus } from "@/lib/actions"
import { ChevronDown, Loader2 } from "lucide-react"

interface EventStatusControlProps {
    eventId: string
    currentStatus: EventStatus
}

export function EventStatusControl({ eventId, currentStatus }: EventStatusControlProps) {
    const [isLoading, setIsLoading] = useState(false)
    const nextStatuses = getNextStatuses(currentStatus)

    const handleStatusChange = async (newStatus: EventStatus) => {
        if (!confirm(`¿Cambiar estado a ${EVENT_STATUS_LABELS[newStatus]}?`)) return

        setIsLoading(true)
        const result = await updateEventStatus(eventId, newStatus)
        setIsLoading(false)

        if (!result.success) {
            alert(result.error || 'Error al cambiar estado')
        }
    }

    // Si no hay transiciones disponibles, solo mostrar el badge
    if (nextStatuses.length === 0) {
        return <EventStatusBadge status={currentStatus} />
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <EventStatusBadge status={currentStatus} />
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {nextStatuses.map(status => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                    >
                        Cambiar a: <span className="ml-1 font-semibold">{EVENT_STATUS_LABELS[status]}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
