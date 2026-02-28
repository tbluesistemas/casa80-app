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
        <div className="flex-1 space-y-4 md:space-y-8 p-4 md:p-8 pt-4 md:pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
            </div>
            <div className="flex-1 flex-col space-y-4 md:space-y-8 flex">
                <UserList initialUsers={users || []} />
            </div>
        </div>
    );
}
