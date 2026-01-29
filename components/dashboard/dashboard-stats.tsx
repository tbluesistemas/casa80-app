'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Package, RotateCcw, BarChart3, TrendingUp } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts"
import Link from "next/link"

interface DashboardStatsProps {
    data: {
        activeReservations: number
        totalInventory: number
        pendingReturns: number
        inventoryValue: number // We receive it but won't show it as a dollar amount
        monthlyStats: Array<{ name: string; value: number; fill: string }>
        categoryStats: Array<{ name: string; value: number }>
    }
}

export function DashboardStats({ data }: DashboardStatsProps) {
    const [showChart, setShowChart] = useState(false)

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                <Link href="/events" className="block text-inherit no-underline">
                    <Card className="hover:bg-muted/50 transition-colors h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Reservas Activas</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.activeReservations}</div>
                            <p className="text-xs text-muted-foreground">
                                Eventos en curso o programados
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/inventory" className="block text-inherit no-underline">
                    <Card className="hover:bg-muted/50 transition-colors h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inventario Total</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.totalInventory}</div>
                            <p className="text-xs text-muted-foreground">
                                Items registrados
                            </p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/events" className="block text-inherit no-underline">
                    <Card className="hover:bg-muted/50 transition-colors h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Devoluciones</CardTitle>
                            <RotateCcw className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.pendingReturns}</div>
                            <p className="text-xs text-muted-foreground">
                                Pendientes de procesar
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-semibold">
                            Estadísticas del Inventario
                        </CardTitle>
                        <CardDescription>
                            {showChart ? "Eventos por mes" : "Distribución por categorías"}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-primary"
                        onClick={() => setShowChart(!showChart)}
                    >
                        <BarChart3 className="h-4 w-4" />
                        {showChart ? "Ver Resumen" : "Ver Gráfica Mensual"}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="min-h-[250px] w-full">
                        {showChart ? (
                            <div className="h-[250px] w-full animate-in fade-in zoom-in-95 duration-300">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="var(--muted-foreground)"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                backgroundColor: 'var(--background)',
                                                color: 'var(--foreground)'
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {data.monthlyStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in zoom-in-95 duration-300">
                                {data.categoryStats.slice(0, 6).map((cat, i) => (
                                    <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-3 w-3 rounded-full shrink-0"
                                                style={{ background: `var(--chart-${(i % 5) + 1})` }}
                                            />
                                            <span className="text-sm font-medium truncate max-w-[120px]" title={cat.name}>
                                                {cat.name}
                                            </span>
                                        </div>
                                        <span className="font-bold tabular-nums">{cat.value}</span>
                                    </div>
                                ))}
                                {data.categoryStats.length > 6 && (
                                    <div className="flex items-center justify-center p-3 text-sm text-muted-foreground">
                                        + {data.categoryStats.length - 6} más...
                                    </div>
                                )}
                                {data.categoryStats.length === 0 && (
                                    <div className="col-span-full flex items-center justify-center p-8 text-muted-foreground">
                                        No hay productos registrados
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
