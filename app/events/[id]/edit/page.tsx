import { getEventById } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EditEventForm } from "@/components/edit-event-form"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { success, data: event, error } = await getEventById(id)

    if (!success || !event) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error || "Evento no encontrado"}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Editar Reserva</h2>
            </div>
            <EditEventForm event={event as any} />
        </div>
    )
}
