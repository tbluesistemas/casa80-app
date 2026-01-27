import { getProducts } from "@/lib/actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Package } from "lucide-react";

export default async function InventoryPage() {
    const { success, data: products, error } = await getProducts();

    if (!success || !products) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error || "No se pudieron cargar los productos."}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Productos Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Imagen</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-right">Cantidad Total</TableHead>
                                <TableHead className="text-right">Precio Reposición</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No hay productos registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {/* Placeholder for image */}
                                            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                                                <Package className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.description}</TableCell>
                                        <TableCell className="text-right">{product.totalQuantity}</TableCell>
                                        <TableCell className="text-right">
                                            ${product.priceReplacement.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
