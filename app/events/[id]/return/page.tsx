import { getEventById } from "@/lib/actions";
import { ReturnForm } from "@/components/return-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function ReturnPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { success, data: event, error } = await getEventById(id);

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
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Gestionar Devolución</h2>
            </div>
            <ReturnForm event={event as any} />
        </div>
    );
}
