import { getEventById } from "@/lib/actions";
import { ReturnForm } from "@/components/return-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function ReturnPage({ params }: { params: { id: string } }) {
    // Await params in newer Next.js or use it directly
    // Next 15 requires await, Next 14 is sync. Assume Next 14 sync for now or async check.
    // Actually params is a promise in recent canary, but 14 is compatible.

    const id = params.id
    const { success, data: event, error } = await getEventById(id);

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
                <h2 className="text-3xl font-bold tracking-tight">Gestionar Devolución</h2>
            </div>
            <ReturnForm event={event as any} />
        </div>
    );
}
