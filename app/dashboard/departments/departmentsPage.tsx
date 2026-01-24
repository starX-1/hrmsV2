'use client'
import { Building2, Users, Plus, User } from 'lucide-react';
import { createDepartment, getAllCompanyDepartments } from '@/app/api/departments';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/utils/authContext';
import { toast } from 'react-toastify';

interface Department {
    id: number;
    name: string;
    description: string;
    companyId: number;
    createdAt: string;
    updatedAt: string;
    manager?: {
        id: number;
        name: string;
        // Add other manager properties
    } | null;
    managerId?: number | null;
    employees: Array<{
        id: number;
        userId: number;
        departmentId: number;
        reportsTo: number | null;
        status: string;
        contractType: string;
        jobTitle: string;
        dateHired: string;
        createdAt: string;
        updatedAt: string;
        user?: {
            id: number;
            name: string;
            email: string;
        };
    }>;
}

interface CreateDepartmentData {
    companyId: string;
    name: string;
    description: string;
}

interface AuthUser {
    id?: string;
    email?: string;
    name?: string;
    companyId?: string;
}

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDepartment, setNewDepartment] = useState<CreateDepartmentData>({
        companyId: '',
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const { user } = useAuth() as { user: AuthUser | null };
    const companyId = user?.companyId || '';

    useEffect(() => {
        if (companyId) {
            fetchDepartments();
        }
    }, [companyId]);

    const fetchDepartments = async () => {
        if (!companyId) {
            console.log('No company ID available');
            setFetchLoading(false);
            return;
        }

        try {
            setFetchLoading(true);
            console.log('Fetching departments for company:', companyId);
            const data = await getAllCompanyDepartments(companyId);
            console.log('Departments data:', data);

            // Handle different response structures
            if (data && Array.isArray(data)) {
                setDepartments(data);
            } else if (data && data.departments && Array.isArray(data.departments)) {
                setDepartments(data.departments);
            } else if (data && Array.isArray(data.data)) {
                setDepartments(data.data);
            } else {
                console.warn('Unexpected API response structure:', data);
                setDepartments([]);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to fetch departments');
            setDepartments([]);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewDepartment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!companyId) {
            toast.error('No company ID found. Please log in again.');
            return;
        }

        if (!newDepartment.name.trim()) {
            toast.error('Please enter a department name');
            return;
        }

        setLoading(true);
        try {
            const departmentData: CreateDepartmentData = {
                companyId,
                name: newDepartment.name.trim(),
                description: newDepartment.description.trim()
            };

            console.log('Creating department with data:', departmentData);
            await createDepartment(departmentData);

            setNewDepartment({
                companyId: '',
                name: '',
                description: ''
            });
            setIsModalOpen(false);

            await fetchDepartments();
            toast.success('Department created successfully!');
        } catch (error: any) {
            console.error('Error creating department:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create department';
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        if (!companyId) {
            toast.error('Please log in to create a department');
            return;
        }
        setNewDepartment({
            companyId,
            name: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewDepartment({
            companyId: '',
            name: '',
            description: ''
        });
    };

    const getDepartmentColor = (name: string): string => {
        const colors = ['#1a462b', '#2d3748', '#2c5282', '#234e52', '#553c9a'];
        const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };

    // Helper function to get department head/manager name
    const getDepartmentHead = (dept: Department): string => {
        if (dept.manager?.name) {
            return dept.manager.name;
        }

        // If no manager assigned, show the first employee or "Not assigned"
        if (dept.employees && dept.employees.length > 0) {
            const firstEmployee = dept.employees[0];
            return firstEmployee.user?.name || `Employee #${firstEmployee.id}`;
        }

        return "Not assigned";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
                    <p className="text-gray-600">Manage your company departments and team structure</p>
                </div>
                <button
                    onClick={openModal}
                    disabled={!companyId}
                    className="px-4 py-2 rounded-lg font-medium text-white flex items-center transition-all hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#1a462b' }}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Department
                </button>
            </div>

            {!companyId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                        Please log in to view and manage departments.
                    </p>
                </div>
            )}

            {/* Departments Grid */}
            {fetchLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-gray-600">Loading departments...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.length === 0 && companyId ? (
                        <div className="col-span-full text-center py-12">
                            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments yet</h3>
                            <p className="text-gray-600">Create your first department to get started</p>
                        </div>
                    ) : (
                        departments.map((dept) => {
                            const color = getDepartmentColor(dept.name);
                            const employeeCount = dept.employees?.length || 0;
                            const departmentHead = getDepartmentHead(dept);

                            return (
                                <div key={dept.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: color + '20' }}
                                        >
                                            <Building2 className="w-6 h-6" style={{ color }} />
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: color + '20', color }}>
                                            {employeeCount} {employeeCount === 1 ? 'member' : 'members'}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                                    {dept.description && (
                                        <p className="text-gray-600 text-sm mb-3">{dept.description}</p>
                                    )}
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <User className="w-4 h-4 mr-2" />
                                        <span className="text-sm">Head: {departmentHead}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button className="text-sm font-medium hover:underline transition-all" style={{ color }}>
                                            View Details
                                        </button>
                                        <button className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-all">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Add Department Modal - Keep your existing modal code */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 -top-6">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add New Department</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newDepartment.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-900"
                                        placeholder="e.g., Finance, Human Resources"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newDepartment.description}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none text-gray-900"
                                        placeholder="Describe the department's responsibilities"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: '#1a462b' }}
                                >
                                    {loading ? 'Creating...' : 'Create Department'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentsPage;