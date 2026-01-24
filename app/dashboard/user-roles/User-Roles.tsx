'use client'

import { useEffect, useState } from "react";
import { Shield, Plus, Edit, Trash2, Search, Filter, Calendar, Building, Users, Check, X } from 'lucide-react';
import { getCompanyRoles, createRole, updateRole, deleteRole } from "@/app/api/roles";
import { useAuth } from "@/app/utils/authContext";

interface Role {
    id: number;
    name: string;
    companyId: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    rolePermissions: any[];
}

const RolesPage = () => {
    const { user } = useAuth();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [saving, setSaving] = useState(false);

    // Delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    // Success/Error messages
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchRoles = async () => {
        try {
            setLoading(true);
            if (user && user.companyId) {
                const data = await getCompanyRoles(user.companyId);
                if (data && data.roles) {
                    setRoles(data.roles);
                }
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            showMessage('error', 'Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, [user]);

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleAddClick = () => {
        setEditingRole(null);
        setFormData({ name: '', description: '' });
        setShowModal(true);
    };

    const handleEditClick = (role: Role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description
        });
        setShowModal(true);
    };

    const handleDeleteClick = (role: Role) => {
        setRoleToDelete(role);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!roleToDelete) return;

        try {
            setSaving(true);
            await deleteRole(roleToDelete.id);

            showMessage('success', `Role "${roleToDelete.name}" deleted successfully`);
            fetchRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
            showMessage('error', 'Failed to delete role');
        } finally {
            setSaving(false);
            setShowDeleteConfirm(false);
            setRoleToDelete(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            showMessage('error', 'Role name is required');
            return;
        }

        if (!user?.companyId) {
            showMessage('error', 'Company ID not found');
            return;
        }

        const roleData = {
            companyId: user.companyId,
            name: formData.name.trim(),
            description: formData.description.trim()
        };

        try {
            setSaving(true);

            if (editingRole) {
                await updateRole(editingRole.id, roleData);
                showMessage('success', `Role "${formData.name}" updated successfully`);
            } else {
                await createRole(roleData);
                showMessage('success', `Role "${formData.name}" created successfully`);
            }

            setShowModal(false);
            fetchRoles();
            setFormData({ name: '', description: '' });
            setEditingRole(null);
        } catch (error: any) {
            console.error('Error saving role:', error);
            showMessage('error', error.message || 'Failed to save role');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Roles Management</h1>
                    <p className="text-gray-600 mt-1">Manage and organize roles within your company</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Role
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Roles</p>
                            <p className="text-2xl font-bold mt-1">{roles.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">With Permissions</p>
                            <p className="text-2xl font-bold mt-1">
                                {roles.filter(r => r.rolePermissions.length > 0).length}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Company ID</p>
                            <p className="text-2xl font-bold mt-1">{user?.companyId || 'N/A'}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search roles by name or description..."
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="text-black flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                </button>
            </div>

            {/* Status Message */}
            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Roles Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                ) : filteredRoles.length === 0 ? (
                    <div className="text-center py-12">
                        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'No roles found' : 'No roles created yet'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm ? 'Try adjusting your search term' : 'Get started by adding your first role'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={handleAddClick}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add First Role
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRoles.map((role) => (
                                    <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center mr-3 border border-green-100">
                                                    <Shield className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{role.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {role.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <span className="text-sm text-gray-600 line-clamp-2">
                                                    {role.description || 'No description'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs rounded-full ${role.rolePermissions.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {role.rolePermissions.length} permission{role.rolePermissions.length !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {formatDate(role.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditClick(role)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
                                                    title="Edit role"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(role)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-red-600 hover:text-red-800 transition-colors"
                                                    title="Delete role"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add/Edit Role Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center mr-3 border border-green-100">
                                        <Shield className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">
                                            {editingRole ? 'Edit Role' : 'Create New Role'}
                                        </h3>
                                        <p className="text-sm text-gray-600">Company ID: {user?.companyId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    disabled={saving}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-black"
                                            placeholder="e.g., Manager, Employee, HR"
                                            disabled={saving}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-black"
                                            rows={4}
                                            placeholder="Describe the responsibilities and purpose of this role..."
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <span className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Saving...
                                            </span>
                                        ) : editingRole ? (
                                            'Update Role'
                                        ) : (
                                            'Create Role'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && roleToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Delete Role</h3>
                                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-800">
                                    Are you sure you want to delete the role <span className="font-semibold">"{roleToDelete.name}"</span>?
                                </p>
                                <p className="text-red-600 text-sm mt-2">
                                    This will remove all associated permissions and cannot be recovered.
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setRoleToDelete(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <span className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Deleting...
                                        </span>
                                    ) : (
                                        'Delete Role'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesPage;