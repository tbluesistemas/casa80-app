import { getProducts } from "@/lib/actions";
import { BookingForm } from "@/components/booking-form";

export default async function NewEventPage() {
    const { data: products } = await getProducts();

    return (
        <div className="flex-1 space-y-4 md:space-y-8 p-4 md:p-8 pt-4 md:pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Nueva Reserva</h2>
            </div>
            <div className="h-full">
                <BookingForm products={products || []} />
            </div>
        </div>
    );
}
