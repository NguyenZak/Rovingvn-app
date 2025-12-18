/**
 * Users Management - Client Component
 * Interactive UI for managing users and roles
 */

"use client";

import { useState, useTransition } from "react";
import { Users, Shield, UserPlus, X, Check } from "lucide-react";
import { assignRole, removeRole } from "@/lib/actions/rbac-actions";
import type { UserWithRoles } from "@/lib/actions/rbac-actions";

interface Role {
    id: string;
    name: string;
    description: string;
}

interface UsersClientProps {
    initialUsers: UserWithRoles[];
    availableRoles: Role[];
}

export function UsersClient({ initialUsers, availableRoles }: UsersClientProps) {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssignRole = (userId: string, roleId: string) => {
        startTransition(async () => {
            const result = await assignRole(userId, roleId);

            if (result.success) {
                // Refresh user data
                setUsers(prev => prev.map(u => {
                    if (u.id === userId) {
                        const role = availableRoles.find(r => r.id === roleId);
                        if (role && !u.roles.some(r => r.id === roleId)) {
                            return { ...u, roles: [...u.roles, role] };
                        }
                    }
                    return u;
                }));
                setMessage({ type: 'success', text: 'Role assigned successfully' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to assign role' });
            }
        });
    };

    const handleRemoveRole = (userId: string, roleId: string) => {
        startTransition(async () => {
            const result = await removeRole(userId, roleId);

            if (result.success) {
                setUsers(prev => prev.map(u => {
                    if (u.id === userId) {
                        return { ...u, roles: u.roles.filter(r => r.id !== roleId) };
                    }
                    return u;
                }));
                setMessage({ type: 'success', text: 'Role removed successfully' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to remove role' });
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage users and assign roles</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                    <Users size={20} />
                    <span className="font-semibold">{users.length} users</span>
                </div>
            </div>

            {/* Success/Error Message */}
            {message && (
                <div className={`px-4 py-3 rounded-lg flex items-center gap-2 ${message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
                    {message.text}
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <input
                    type="text"
                    placeholder="Search users by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">User</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Roles</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Joined</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <span className="text-emerald-700 font-semibold">
                                                {user.email[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.email}</div>
                                            <div className="text-sm text-gray-500">{user.id}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <div
                                                    key={role.id}
                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                                                >
                                                    <Shield size={12} />
                                                    {role.name}
                                                    <button
                                                        onClick={() => handleRemoveRole(user.id, role.id)}
                                                        disabled={isPending}
                                                        className="ml-1 hover:text-blue-900 disabled:opacity-50"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-400">No roles</span>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <UserPlus size={16} />
                                        Assign Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found
                    </div>
                )}
            </div>

            {/* Assign Role Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Assign Role</h3>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {availableRoles.map((role) => {
                                const userHasRole = users
                                    .find(u => u.id === selectedUser)
                                    ?.roles.some(r => r.id === role.id);

                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => {
                                            if (!userHasRole) {
                                                handleAssignRole(selectedUser, role.id);
                                                setSelectedUser(null);
                                            }
                                        }}
                                        disabled={userHasRole || isPending}
                                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${userHasRole
                                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                            : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
                                            }`}
                                    >
                                        <div className="font-medium">{role.name}</div>
                                        <div className="text-sm text-gray-500">{role.description}</div>
                                        {userHasRole && (
                                            <div className="text-xs text-gray-400 mt-1">Already assigned</div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
