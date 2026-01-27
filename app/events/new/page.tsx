import { getProducts } from "@/lib/actions";
import { BookingForm } from "@/components/booking-form";

export default async function NewEventPage() {
    const { data: products } = await getProducts();

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Nueva Reserva</h2>
            </div>
            <BookingForm products={products || []} />
        </div>
    );
}
