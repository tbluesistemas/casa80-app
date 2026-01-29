import { getProducts } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InventoryClient } from "@/components/inventory/inventory-client"

export default async function InventoryPage() {
    const { success, data: products, error } = await getProducts()

    if (!success || !products) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <AlertTitle>Error al Cargar</AlertTitle>
                    <AlertDescription>{error || "No se pudieron cargar los productos."}</AlertDescription>
                </Alert>
            </div>
        )
    }

    // Serialize dates to avoid hydration errors
    const serializedProducts = products.map(p => ({
        ...p,
        updatedAt: p.updatedAt.toISOString(),
        createdAt: p.createdAt.toISOString()
    }))

    return <InventoryClient products={serializedProducts} />
}
