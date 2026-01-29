import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Package, RotateCcw, TrendingUp } from "lucide-react";
import { SeedButton } from "@/components/seed-button";
import styles from "./home.module.css";
import { getDashboardStats } from "@/lib/actions";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { getStatusLabel } from "@/lib/utils-status";

export default async function Home() {
    const stats = await getDashboardStats();
    const data = stats.success && stats.data ? stats.data : {
        activeReservations: 0,
        totalInventory: 0,
        inventoryValue: 0,
        pendingReturns: 0,
        recentEvents: [],
        categoryStats: [],
        monthlyStats: []
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-MX', {
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'short'
        }).format(new Date(date));
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Casa80</h2>
            </div>

            <DashboardStats data={data} />

            <div className={styles.mainGrid}>
                <Card className={styles.quickActionsCard}>
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                        <CardDescription>
                            Gestiona el inventario y las reservas desde aquí.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className={styles.cardContentActions}>
                        <div className={styles.actionsGrid}>
                            <Link href="/events/new">
                                <Button className={styles.actionButton} variant="outline">
                                    <CalendarDays className={styles.actionIcon} />
                                    Nueva Reserva
                                </Button>
                            </Link>
                            <Link href="/inventory">
                                <Button className={styles.actionButton} variant="outline">
                                    <Package className={styles.actionIcon} />
                                    Ver Inventario
                                </Button>
                            </Link>
                            <Link href="/events">
                                <Button className={styles.actionButton} variant="outline">
                                    <RotateCcw className={styles.actionIcon} />
                                    Gestionar Devoluciones
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card className={styles.eventsCard}>
                    <CardHeader>
                        <Link href="/events" className="hover:underline">
                            <CardTitle>Próximos Eventos &rarr;</CardTitle>
                        </Link>
                        <CardDescription>Eventos programados próximamente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.eventsList}>
                            {data.recentEvents.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No hay eventos próximos.</p>
                            ) : (
                                data.recentEvents.map((event: any) => (
                                    <Link key={event.id} href={`/events/${event.id}`}>
                                        <div className={`${styles.eventItem} ${styles.clickableRow}`}>
                                            <div className={styles.eventInfo}>
                                                <p className={styles.eventName}>{event.name}</p>
                                                <p className={styles.eventTime}>
                                                    {formatDate(event.startDate)}
                                                </p>
                                            </div>
                                            <div className={styles.eventStatus}>{getStatusLabel(event.status)}</div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
