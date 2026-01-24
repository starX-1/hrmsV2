'use client'

import { useEffect, useState } from "react";
import { Shield, Search, Check, X, RefreshCw } from 'lucide-react';
import { getCompanyRoles } from "@/app/api/roles";
import { getPermissions } from "../../api/roles";
import { assignPermissionToRole, removePermissionFromRole, getRolePermissions } from "../../api/roles";
import { useAuth } from "@/app/utils/authContext";

interface Role {
    id: number;
    name: string;
    companyId: number;
    description: string;
    createdAt: string;
}

interface Permission {
    id: number;
    moduleId: number;
    name: string;
    description: string;
    module: {
        id: number;
        name: string;
    };
}

const RolePermissionsPage = () => {
    const { user } = useAuth();
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [rolePermissions, setRolePermissions] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);

            if (user?.companyId) {
                // Fetch roles
                const rolesData = await getCompanyRoles(user.companyId);
                if (rolesData?.roles) {
                    setRoles(rolesData.roles);
                    if (rolesData.roles.length > 0) {
                        setSelectedRole(rolesData.roles[0]);
                    }
                }

                // Fetch permissions and exclude specified modules
                const permissionsData = await getPermissions();
                if (permissionsData?.permissions) {
                    const filtered = permissionsData.permissions.filter((p: Permission) => {
                        // Exclude these modules:
                        // Role Permission (id: 38), User Role (id: 37), Module (id: 36), Permission (id: 35)
                        // Also exclude Company (id: 28) and Role (id: 34) as before
                        const excludedModules = [28, 34, 35, 36, 37, 38];
                        return !excludedModules.includes(p.moduleId);
                    });
                    setPermissions(filtered);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch role permissions
    const fetchRolePermissions = async (roleId: number) => {
        try {
            const data = await getRolePermissions(roleId);
            if (data?.rolePermissions) {
                const permIds = data.rolePermissions.map((rp: any) => rp.permissionId);
                setRolePermissions(permIds);
            }
        } catch (error) {
            console.error('Error fetching role permissions:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    useEffect(() => {
        if (selectedRole) {
            fetchRolePermissions(selectedRole.id);
        }
    }, [selectedRole]);

    // Filter permissions
    const filteredPermissions = permissions.filter(perm =>
        perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.module.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group permissions by module
    const permissionsByModule = filteredPermissions.reduce((acc: Record<string, Permission[]>, perm) => {
        const moduleName = perm.module.name;
        if (!acc[moduleName]) {
            acc[moduleName] = [];
        }
        acc[moduleName].push(perm);
        return acc;
    }, {});

    // Check if permission is assigned
    const isPermissionAssigned = (permissionId: number) => {
        return rolePermissions.includes(permissionId);
    };

    // Toggle permission
    const togglePermission = async (permissionId: number) => {
        if (!selectedRole) return;

        const isAssigned = isPermissionAssigned(permissionId);

        try {
            setSaving(true);

            if (isAssigned) {
                await removePermissionFromRole(selectedRole.id, permissionId);
                setRolePermissions(prev => prev.filter(id => id !== permissionId));
            } else {
                await assignPermissionToRole(selectedRole.id, permissionId);
                setRolePermissions(prev => [...prev, permissionId]);
            }
        } catch (error) {
            console.error('Error toggling permission:', error);
        } finally {
            setSaving(false);
        }
    };

    // Toggle all permissions in a module
    const toggleModulePermissions = async (moduleName: string) => {
        if (!selectedRole) return;

        const modulePerms = permissionsByModule[moduleName];
        const allAssigned = modulePerms.every(perm => isPermissionAssigned(perm.id));

        try {
            setSaving(true);

            for (const perm of modulePerms) {
                const isAssigned = isPermissionAssigned(perm.id);

                if (allAssigned && isAssigned) {
                    await removePermissionFromRole(selectedRole.id, perm.id);
                    setRolePermissions(prev => prev.filter(id => id !== perm.id));
                } else if (!allAssigned && !isAssigned) {
                    await assignPermissionToRole(selectedRole.id, perm.id);
                    setRolePermissions(prev => [...prev, perm.id]);
                }
            }
        } catch (error) {
            console.error('Error toggling module permissions:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading permissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Role Permissions</h1>
                    <p className="text-gray-600 mt-1">Assign permissions to roles</p>
                </div>
            </div>

            {/* Role Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Select Role</h3>
                    <div className="text-sm text-gray-500">
                        {rolePermissions.length} permissions assigned
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role)}
                            className={`px-4 py-2 rounded-lg border transition-all ${selectedRole?.id === role.id ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {role.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search permissions..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Permissions Table */}
            {!selectedRole ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Please select a role to manage permissions</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800">Permissions for: {selectedRole.name}</h3>
                                <p className="text-sm text-gray-600">{selectedRole.description}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                Click buttons to assign/remove permissions
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Permission
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Object.entries(permissionsByModule).map(([moduleName, modulePerms], moduleIndex) => (
                                    <>
                                        {/* Module Header */}
                                        <tr key={moduleName} className="bg-gray-50">
                                            <td colSpan={6} className="px-6 py-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Shield className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="font-medium text-gray-900">{moduleName}</span>
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            ({modulePerms.length} permissions)
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleModulePermissions(moduleName)}
                                                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                                                        disabled={saving}
                                                    >
                                                        {modulePerms.every(perm => isPermissionAssigned(perm.id))
                                                            ? 'Remove All'
                                                            : 'Assign All'
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Module Permissions */}
                                        {modulePerms.map((perm, permIndex) => {
                                            const isAssigned = isPermissionAssigned(perm.id);
                                            return (
                                                <tr key={perm.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {moduleIndex + 1}.{permIndex + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{perm.module.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {perm.name.replace(/_/g, ' ')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600 max-w-md">
                                                            {perm.description}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${isAssigned ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {isAssigned ? 'Assigned' : 'Not Assigned'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => togglePermission(perm.id)}
                                                            disabled={saving}
                                                            className={`px-3 py-1 text-sm rounded border ${isAssigned ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}
                                                        >
                                                            {isAssigned ? 'Remove' : 'Assign'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                ))}

                                {Object.keys(permissionsByModule).length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                {searchTerm ? 'No permissions found matching your search' : 'No permissions available'}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-600">
                                Showing {permissions.length} permissions
                            </div>
                            <div className="text-gray-600">
                                Assigned to {selectedRole.name}: {rolePermissions.length}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => fetchRolePermissions(selectedRole.id)}
                                    className="flex items-center text-gray-600 hover:text-gray-800"
                                    disabled={saving}
                                >
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                    Refresh
                                </button>
                                {saving && (
                                    <span className="text-green-600">Saving...</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolePermissionsPage;