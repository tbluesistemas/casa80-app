import { getUsers, registerUser, deleteUser } from "@/lib/actions";
import { UserList } from "@/components/admin/user-list";
import { getCurrentRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const role = await getCurrentRole();
    if (role !== 'ADMIN') {
        redirect('/');
    }

    const { data: users } = await getUsers();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <UserList initialUsers={users || []} />
            </div>
        </div>
    );
}
