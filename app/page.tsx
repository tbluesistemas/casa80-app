import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Package, RotateCcw, TrendingUp } from "lucide-react";
import { SeedButton } from "@/components/seed-button";

export default function Home() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <SeedButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reservas Activas
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde la semana pasada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventario Total
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+500</div>
            <p className="text-xs text-muted-foreground">
              Items disponibles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoluciones Pendientes</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Requieren revisión
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% respecto al mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona el inventario y las reservas desde aquí.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/events/new">
                <Button className="w-full h-24 text-lg flex flex-col gap-2" variant="outline">
                  <CalendarDays className="h-6 w-6" />
                  Nueva Reserva
                </Button>
              </Link>
              <Link href="/inventory">
                <Button className="w-full h-24 text-lg flex flex-col gap-2" variant="outline">
                  <Package className="h-6 w-6" />
                  Ver Inventario
                </Button>
              </Link>
              <Link href="/events">
                <Button className="w-full h-24 text-lg flex flex-col gap-2" variant="outline">
                  <RotateCcw className="h-6 w-6" />
                  Gestionar Devoluciones
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Eventos programados para esta semana.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Placeholder for recent events */}
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Boda Gomez-Perez</p>
                  <p className="text-sm text-muted-foreground">
                    Mañana, 14:00 PM
                  </p>
                </div>
                <div className="ml-auto font-medium">Activo</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Cumpleaños XV</p>
                  <p className="text-sm text-muted-foreground">
                    Sábado, 18:00 PM
                  </p>
                </div>
                <div className="ml-auto font-medium">Pendiente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
