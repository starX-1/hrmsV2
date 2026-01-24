'use client'
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { fetchLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType } from '@/app/api/leave';
import { useAuth } from '@/app/utils/authContext';

//  Types
interface LeaveType {
    id: number;
    name: string;
    maxDaysPerYear: number;
    requiresApproval: boolean;
    createdAt: string;
    updatedAt: string;
}

interface LeaveTypeFormData {
    name: string;
    maxDaysPerYear: number;
    requiresApproval: boolean;
}


const LeaveTypesManager = () => {
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState<any>(null);
    const [isCreating, setIsCreating] = useState(false);
    const { user } = useAuth() as { user: any };

    const [formData, setFormData] = useState<LeaveTypeFormData>({
        name: '',
        maxDaysPerYear: 30,
        requiresApproval: true
    });

    // Load leave types on component mount
    useEffect(() => {
        getLeaveTypes();
    }, [user?.companyId]);

    const getLeaveTypes = async () => {
        try {
            setLoading(true);
            setError('');
            const data: any = await fetchLeaveTypes(user.companyId);
            console.log('Leave types data:', data);
            setLeaveTypes(data?.leaveTypes);
        } catch (err) {
            setError('Failed to fetch leave types');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'maxDaysPerYear') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEdit = (leaveType: LeaveType) => {
        setIsEditing(leaveType.id);
        setFormData({
            name: leaveType.name,
            maxDaysPerYear: leaveType.maxDaysPerYear,
            requiresApproval: leaveType.requiresApproval
        });
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsCreating(false);
        // reset all errors and success messages
        setError('');
        setSuccess('');
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            maxDaysPerYear: 30,
            requiresApproval: true
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setError('');
            setSuccess('');

            if (isCreating) {
                const data = {
                    ...formData,
                    companyId: user.companyId
                }
                // console.log('Creating leave type with data:', data);
                await createLeaveType(data);
                // setL eaveTypes(prev => [...prev, newLeaveType]);\
                // refetch leaveTypes
                await getLeaveTypes();
                setSuccess('Leave type created successfully');
                setIsCreating(false);
            } else if (isEditing) {
                // const leaveId = isEditing;
                const data = {
                    name: formData.name,
                    maxDaysPerYear: formData.maxDaysPerYear,
                    requiresApproval: formData.requiresApproval,
                    companyId: user.companyId
                }
                const updatedLeaveType = await updateLeaveType(isEditing, data);
                // setLeaveTypes(prev => prev.map(lt =>
                //   lt.id === isEditing ? updatedLeaveType : lt
                // ));
                // refetch leaveTypes
                await getLeaveTypes();
                setSuccess('Leave type updated successfully');
                setIsEditing(null);
            }

            resetForm();
        } catch (err) {
            setError(isCreating ? 'Failed to create leave type' : 'Failed to update leave type');
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this leave type?')) return;

        try {
            setError('');
            await deleteLeaveType(id);
            setLeaveTypes(prev => prev.filter(lt => lt.id !== id));
            setSuccess('Leave type deleted successfully');
        } catch (err) {
            setError('Failed to delete leave type');
            console.error(err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#1a462b' }}></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Leave Types</h1>
                <p className="text-gray-600">Create and manage different types of leave for your organization</p>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                </div>
            )}

            {/* Create New Leave Type Button */}
            {!isCreating && (
                <button
                    onClick={() => {
                        setIsCreating(true);
                        setIsEditing(null);
                        resetForm();
                    }}
                    className="mb-6 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    style={{ backgroundColor: '#1a462b' }}
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-white font-medium">Add New Leave Type</span>
                </button>
            )}

            {/* Create/Edit Form */}
            {(isCreating || isEditing) && (
                <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {isCreating ? 'Create New Leave Type' : 'Edit Leave Type'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Leave Type Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a462b] focus:border-transparent"
                                    // style={{ focusRingColor: '#1a462b' }}
                                    placeholder="e.g., Annual Leave"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Maximum Days Per Year *
                                </label>
                                <input
                                    type="number"
                                    name="maxDaysPerYear"
                                    value={formData.maxDaysPerYear}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max="365"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a462b] focus:border-transparent"
                                // style={{ focusRingColor: '#1a462b' }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 pt-2">
                            <input
                                type="checkbox"
                                id="requiresApproval"
                                name="requiresApproval"
                                checked={formData.requiresApproval}
                                onChange={handleInputChange}
                                className="w-4 h-4 rounded border-gray-300"
                                style={{ accentColor: '#1a462b' }}
                            />
                            <label htmlFor="requiresApproval" className="text-sm font-medium text-gray-700">
                                Requires Manager Approval
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                                style={{ backgroundColor: '#1a462b' }}
                            >
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    {isCreating ? 'Create Leave Type' : 'Update Leave Type'}
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <X className="w-4 h-4" />
                                    Cancel
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Leave Types List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Leave Types ({leaveTypes.length})</h2>
                </div>

                {leaveTypes.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>No leave types found. Create your first leave type to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Leave Type</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Max Days/Year</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Approval Required</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {leaveTypes.map((leaveType) => (
                                    <tr key={leaveType.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="font-medium text-gray-900">{leaveType.name}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                {leaveType.maxDaysPerYear} days
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {leaveType.requiresApproval ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 text-sm">
                                            {formatDate(leaveType.updatedAt)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(leaveType)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(leaveType.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
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

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600">Total Leave Types</p>
                    <p className="text-2xl font-semibold mt-1" style={{ color: '#1a462b' }}>{leaveTypes.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600">Requiring Approval</p>
                    <p className="text-2xl font-semibold mt-1" style={{ color: '#1a462b' }}>
                        {leaveTypes.filter(lt => lt.requiresApproval).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600">Average Days/Year</p>
                    <p className="text-2xl font-semibold mt-1" style={{ color: '#1a462b' }}>
                        {leaveTypes.length > 0
                            ? Math.round(leaveTypes.reduce((sum, lt) => sum + lt.maxDaysPerYear, 0) / leaveTypes.length)
                            : 0
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LeaveTypesManager;