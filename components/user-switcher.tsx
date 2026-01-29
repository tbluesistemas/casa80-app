'use client'

import { useAuth } from '@/components/auth-provider'
import { switchUserRole, UserRole } from '@/lib/auth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Shield, ShieldAlert, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'

export function UserSwitcher() {
    const { role, setRole } = useAuth()

    const handleSwitch = async (newRole: UserRole) => {
        await switchUserRole(newRole)
        setRole(newRole)
        toast.success(`Rol cambiado a ${newRole === 'ADMIN' ? 'Administrador' : 'Visualizador'}`)
        window.location.reload() // Force reload to ensure server components update
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-12">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className={role === 'ADMIN' ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                            {role === 'ADMIN' ? 'AD' : 'VI'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                        <span className="font-medium">{role === 'ADMIN' ? 'Administrador' : 'Visualizador'}</span>
                        <span className="text-xs text-muted-foreground">Cambiar rol</span>
                    </div>
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>Seleccionar Rol</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSwitch('ADMIN')}>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    <span>Administrador</span>
                    {role === 'ADMIN' && <span className="ml-auto text-xs">Actual</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSwitch('VIEWER')}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Visualizador</span>
                    {role === 'VIEWER' && <span className="ml-auto text-xs">Actual</span>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
