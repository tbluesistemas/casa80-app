'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, Pencil, PauseCircle, PlayCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { registerUser, deleteUser, updateUser, toggleUserActive } from "@/lib/actions"
import { useRouter } from "next/navigation"

type User = {
    id: string
    name: string | null
    email: string
    role: string
    active: boolean
    createdAt: Date
}

export function UserList({ initialUsers }: { initialUsers: User[] }) {
    const [users] = useState<User[]>(initialUsers)
    const [open, setOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const router = useRouter()

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VIEWER'
    })

    const [editUser, setEditUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VIEWER'
    })

    const handleCreate = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            toast.error("Todos los campos son obligatorios")
            return
        }

        setLoading(true)
        const res = await registerUser(newUser)
        setLoading(false)

        if (res.success) {
            toast.success("Usuario creado correctamente")
            setOpen(false)
            setNewUser({ name: '', email: '', password: '', role: 'VIEWER' })
            router.refresh()
        } else {
            toast.error(res.error || "Error al crear usuario")
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("¿Estás seguro de eliminar este usuario?")) return

        const res = await deleteUser(userId)
        if (res.success) {
            toast.success("Usuario eliminado")
            router.refresh()
        } else {
            toast.error(res.error)
        }
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setEditUser({
            name: user.name || '',
            email: user.email,
            password: '', // Leave empty - only update if provided
            role: user.role
        })
        setEditOpen(true)
    }

    const handleUpdate = async () => {
        if (!editingUser) return

        if (!editUser.name || !editUser.email) {
            toast.error("Nombre y email son obligatorios")
            return
        }

        setLoading(true)
        const res = await updateUser(editingUser.id, {
            name: editUser.name,
            email: editUser.email,
            password: editUser.password, // Only updates if not empty
            role: editUser.role
        })
        setLoading(false)

        if (res.success) {
            toast.success("Usuario actualizado correctamente")
            setEditOpen(false)
            setEditingUser(null)
            setEditUser({ name: '', email: '', password: '', role: 'VIEWER' })
            router.refresh()
        } else {
            toast.error(res.error || "Error al actualizar usuario")
        }
    }

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        const action = currentStatus ? 'pausar' : 'activar'
        if (!confirm(`¿Estás seguro de ${action} este usuario?`)) return

        const res = await toggleUserActive(userId)
        if (res.success) {
            toast.success(`Usuario ${currentStatus ? 'pausado' : 'activado'} correctamente`)
            router.refresh()
        } else {
            toast.error(res.error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Usuario
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[425px] rounded-lg">
                        <DialogHeader>
                            <DialogTitle>Nuevo Usuario</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-xs sm:text-sm">Nombre</Label>
                                <Input
                                    className="col-span-3"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-xs sm:text-sm">Email</Label>
                                <Input
                                    className="col-span-3"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-xs sm:text-sm">Contraseña</Label>
                                <Input
                                    className="col-span-3"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-xs sm:text-sm">Rol</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VIEWER">Visualizador</SelectItem>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={loading} className="w-full sm:w-auto">
                                {loading ? "Creando..." : "Crear Usuario"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="w-[95vw] max-w-[425px] rounded-lg">
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-xs sm:text-sm">Nombre</Label>
                                <Input
                                    className="col-span-3"
                                    value={editUser.name}
                                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-xs sm:text-sm">Email</Label>
                                <Input
                                    className="col-span-3"
                                    type="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-xs sm:text-sm">Contraseña</Label>
                                <div className="col-span-3 space-y-1">
                                    <Input
                                        type="password"
                                        value={editUser.password}
                                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                        placeholder="Dejar vacío"
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        Solo para cambiarla
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right text-xs sm:text-sm">Rol</Label>
                                <Select
                                    value={editUser.role}
                                    onValueChange={(val) => setEditUser({ ...editUser, role: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VIEWER">Visualizador</SelectItem>
                                        <SelectItem value="ADMIN">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleUpdate} disabled={loading} className="w-full sm:w-auto">
                                {loading ? "Actualizando..." : "Actualizar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-3">
                {users.map((user) => (
                    <div key={user.id} className="border rounded-md p-4 bg-card space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="min-w-0">
                                <div className="font-bold truncate">{user.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${user.role === 'ADMIN'
                                    ? 'bg-purple-50 text-purple-700 ring-purple-700/10'
                                    : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                    }`}>
                                    {user.role}
                                </span>
                                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${user.active
                                    ? 'bg-green-50 text-green-700 ring-green-700/10'
                                    : 'bg-red-50 text-red-700 ring-red-700/10'
                                    }`}>
                                    {user.active ? 'Activo' : 'Pausado'}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleToggleActive(user.id, user.active)}
                            >
                                {user.active ? (
                                    <><PauseCircle className="h-3.5 w-3.5 mr-1 text-orange-500" /> Pausar</>
                                ) : (
                                    <><PlayCircle className="h-3.5 w-3.5 mr-1 text-green-500" /> Activar</>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleEdit(user)}
                            >
                                <Pencil className="h-3.5 w-3.5 mr-1 text-blue-500" /> Editar
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleDelete(user.id)}
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-1 text-red-500" /> Borrar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.role === 'ADMIN'
                                        ? 'bg-purple-50 text-purple-700 ring-purple-700/10'
                                        : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                        }`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.active
                                        ? 'bg-green-50 text-green-700 ring-green-700/10'
                                        : 'bg-red-50 text-red-700 ring-red-700/10'
                                        }`}>
                                        {user.active ? 'Activo' : 'Pausado'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleToggleActive(user.id, user.active)}
                                        title={user.active ? 'Pausar usuario' : 'Activar usuario'}
                                    >
                                        {user.active ? (
                                            <PauseCircle className="h-4 w-4 text-orange-500" />
                                        ) : (
                                            <PlayCircle className="h-4 w-4 text-green-500" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <Pencil className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
