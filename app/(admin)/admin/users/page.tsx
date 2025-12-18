/**
 * Users Management Page
 * Admin can view all users and assign roles
 */

import { getAllUsersWithRoles, getAllRoles } from "@/lib/actions/rbac-actions";
import { UsersClient } from "./UsersClient";

export const metadata = {
    title: "User Management | Admin",
    description: "Manage users and assign roles",
};

export default async function UsersPage() {
    const [usersResult, rolesResult] = await Promise.all([
        getAllUsersWithRoles(),
        getAllRoles()
    ]);

    const users = usersResult.success ? usersResult.data || [] : [];
    const roles = rolesResult.success ? rolesResult.data : [];

    return <UsersClient initialUsers={users} availableRoles={roles || []} />;
}
