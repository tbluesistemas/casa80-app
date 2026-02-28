import { getEventById, getProducts } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EditEventForm } from "@/components/edit-event-form"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [eventResult, productsResult] = await Promise.all([
        getEventById(id),
        getProducts()
    ])

    const { success, data: event, error } = eventResult
    const products = productsResult.success ? productsResult.data : []

    if (!success || !event) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <AlertTitle>Error al Cargar</AlertTitle>
                    <AlertDescription>{error || "Evento no encontrado"}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 md:space-y-8 p-4 md:p-8 pt-4 md:pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Editar Reserva</h2>
            </div>
            <EditEventForm event={event as any} allProducts={products || []} />
        </div>
    )
}
