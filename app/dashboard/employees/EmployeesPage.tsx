'use client'
import { Search, Filter, User, Mail, Phone, Calendar, Plus, Edit, Trash2, Eye, X, Building2 } from 'lucide-react';
import { getCompanyRoles } from '@/app/api/roles';
import { createEmployee, updateEmployee, deleteEmployee, getCompanyEmployees } from '@/app/api/employees';
import { assignUserToRole } from '@/app/api/roles';
import { useAuth } from '@/app/utils/authContext';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllCompanyDepartments } from '@/app/api/departments';

interface ApiEmployee {
    employees: {
        id: number;
        userId: number;
        departmentId: string | null;
        reportsTo: number | null;
        status: string;
        contractType: string;
        jobTitle: string;
        dateHired: string;
        createdAt: string;
        updatedAt: string;
    };
    users: {
        id: number;
        companyId: number;
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
        password: string;
        gender: string;
        imageUrl: string;
        createdAt: string;
        updatedAt: string;
    };
    departments: {
        id?: string;
        name?: string;
    } | null;
}

interface Employee {
    id: number;
    userId: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    contractType: 'full_time' | 'part_time' | 'contract' | 'freelance';
    jobTitle: string;
    dateHired: string;
    departmentId: string | null;
    departmentName: string | null;
    status: string;
    roleId?: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
}

interface Department {
    id: string;
    name: string;
}

interface CreateEmployeeData {
    companyId: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    contractType: 'full_time' | 'part_time' | 'contract' | 'freelance';
    jobTitle: string;
    dateHired: string;
    departmentId: string;
}

const EmployeesPage = () => {
    const { user } = useAuth() as { user: any };
    const companyId = user?.companyId as string;

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);

    // Form states
    const [newEmployee, setNewEmployee] = useState<CreateEmployeeData>({
        companyId: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: 'male',
        contractType: 'full_time',
        jobTitle: '',
        dateHired: new Date().toISOString().split('T')[0],
        departmentId: ''
    });

    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedRoleId, setSelectedRoleId] = useState('');

    // Fetch data on component mount
    useEffect(() => {
        if (companyId) {
            fetchEmployees();
            fetchRoles();
            fetchDepartments();
        }
    }, [companyId]);

    const fetchEmployees = async () => {
        try {
            const response = await getCompanyEmployees(companyId);
            const apiEmployees: ApiEmployee[] = response.employees || [];

            // Transform the API data to match our Employee interface
            const transformedEmployees: Employee[] = apiEmployees.map(item => ({
                id: item.employees.id,
                userId: item.employees.userId,
                firstname: item.users.firstname,
                lastname: item.users.lastname,
                email: item.users.email,
                phone: item.users.phone,
                gender: (item.users.gender as 'male' | 'female' | 'other') || 'other',
                contractType: (item.employees.contractType as 'full_time' | 'part_time' | 'contract' | 'freelance') || 'full_time',
                jobTitle: item.employees.jobTitle || 'Employee',
                dateHired: item.employees.dateHired,
                departmentId: item.employees.departmentId,
                departmentName: item.departments?.name || null,
                status: item.employees.status || 'active'
            }));

            setEmployees(transformedEmployees);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Failed to fetch employees');
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await getCompanyRoles(companyId);
            setRoles(data.roles || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Failed to fetch roles');
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await getAllCompanyDepartments(companyId);
            setDepartments(response.departments || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to fetch departments');
        }
    };

    // Filter employees
    const filteredEmployees = employees.filter(emp => {
        const fullName = `${emp.firstname} ${emp.lastname}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = !filterDept || emp.departmentId === filterDept;
        return matchesSearch && matchesDept;
    });

    const getDepartmentName = (deptId: string | null) => {
        if (!deptId) return 'No Department';
        const dept = departments.find(d => d.id === deptId);
        return dept?.name || 'Unknown';
    };

    // Add Employee
    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) {
            toast.error('No company ID found');
            return;
        }

        setLoading(true);
        try {
            const employeeData = {
                ...newEmployee,
                companyId: companyId
            };

            const response = await createEmployee(employeeData);

            // Reset form and close modal
            setNewEmployee({
                companyId: '',
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                gender: 'male',
                contractType: 'full_time',
                jobTitle: '',
                dateHired: new Date().toISOString().split('T')[0],
                departmentId: departments[0]?.id || ''
            });
            setIsAddModalOpen(false);

            // Refresh employees list
            await fetchEmployees();

            toast.success('Employee created successfully!');

            // Open role assignment modal for the new employee
            // Assuming the response contains the created employee with userId
            if (response && response.employee.userId) {
                setSelectedEmployee({
                    id: response.employee.id || 0,
                    userId: response.employee.userId,
                    firstname: response.employee.firstname || '',
                    lastname: response.employee.lastname || '',
                    email: response.employee.email || '',
                    phone: response.employee.phone || '',
                    gender: response.employee.gender || 'male',
                    contractType: response.employee.contractType || 'full_time',
                    jobTitle: response.employee.jobTitle || '',
                    dateHired: response.employee.dateHired || new Date().toISOString().split('T')[0],
                    departmentId: response.employee.departmentId || null,
                    departmentName: null,
                    status: 'active'
                });
                setIsAssignRoleModalOpen(true);
            }

        } catch (error: any) {
            console.error('Error creating employee:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create employee';
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // Edit Employee
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editEmployee) return;

        setLoading(true);
        try {
            // Prepare update data - we need to structure this based on your API
            const updateData = {
                firstname: editEmployee.firstname,
                lastname: editEmployee.lastname,
                email: editEmployee.email,
                phone: editEmployee.phone,
                gender: editEmployee.gender,
                jobTitle: editEmployee.jobTitle,
                contractType: editEmployee.contractType,
                dateHired: editEmployee.dateHired,
                departmentId: editEmployee.departmentId
            };

            await updateEmployee(editEmployee.id.toString(), updateData);

            setIsEditModalOpen(false);
            setEditEmployee(null);
            await fetchEmployees();

            toast.success('Employee updated successfully!');
        } catch (error: any) {
            console.error('Error updating employee:', error);
            toast.error(error?.message || 'Failed to update employee');
        } finally {
            setLoading(false);
        }
    };

    // Delete Employee
    const handleDelete = async () => {
        if (!employeeToDelete) return;

        setLoading(true);
        try {
            await deleteEmployee(employeeToDelete.id.toString());

            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
            await fetchEmployees();

            toast.success('Employee deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting employee:', error);
            toast.error(error?.message || 'Failed to delete employee');
        } finally {
            setLoading(false);
        }
    };

    // Assign Role
    const handleAssignRole = async () => {
        if (!selectedEmployee?.userId || !selectedRoleId) {
            toast.error('Missing user ID or role selection');
            return;
        }

        setLoading(true);
        try {
            const data = {
                userId: selectedEmployee.userId.toString(),
                roleId: selectedRoleId
            };

            await assignUserToRole(data);

            setIsAssignRoleModalOpen(false);
            setSelectedEmployee(null);
            setSelectedRoleId('');
            await fetchEmployees();

            toast.success('Role assigned successfully!');
        } catch (error: any) {
            console.error('Error assigning role:', error);
            toast.error(error?.message || 'Failed to assign role');
        } finally {
            setLoading(false);
        }
    };

    // Modal open handlers
    const openAddModal = () => {
        if (!companyId) {
            toast.error('Please log in to add employees');
            return;
        }
        setNewEmployee({
            companyId: '',
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            gender: 'male',
            contractType: 'full_time',
            jobTitle: '',
            dateHired: new Date().toISOString().split('T')[0],
            departmentId: departments[0]?.id || ''
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (employee: Employee) => {
        setEditEmployee(employee);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setIsDeleteModalOpen(true);
    };

    const openViewModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsViewModalOpen(true);
    };

    const openAssignRoleModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        setSelectedRoleId(employee.roleId || '');
        setIsAssignRoleModalOpen(true);
    };

    // Close all modals
    const closeAllModals = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsViewModalOpen(false);
        setIsAssignRoleModalOpen(false);
        setEditEmployee(null);
        setEmployeeToDelete(null);
        setSelectedEmployee(null);
        setSelectedRoleId('');
    };

    // Format status for display
    const formatStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
                    <p className="text-gray-600">Manage your organization&#39;s workforce</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-black"
                        />
                    </div>
                    <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={openAddModal}
                        disabled={!companyId}
                        className="px-4 py-2 rounded-lg font-medium text-white flex items-center transition-all hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#1a462b' }}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Employee</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Contact</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Department</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Job Title</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => {
                                const deptName = getDepartmentName(emp.departmentId);

                                return (
                                    <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                    <User className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{emp.firstname} {emp.lastname}</div>
                                                    <div className="text-sm text-gray-500">ID: EMP-{emp.id.toString().padStart(4, '0')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    {emp.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    {emp.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                {deptName}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">{emp.jobTitle}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-800' :
                                                emp.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                                                    emp.status === 'terminated' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {formatStatus(emp.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => openViewModal(emp)}
                                                    className="text-gray-600 hover:text-gray-800 hover:underline transition-all text-sm"
                                                    title="View details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(emp)}
                                                    className="text-green-700 hover:text-green-900 hover:underline transition-all text-sm"
                                                    title="Edit employee"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openAssignRoleModal(emp)}
                                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-all text-sm"
                                                    title="Assign role"
                                                >
                                                    <User className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(emp)}
                                                    className="text-red-600 hover:text-red-800 hover:underline transition-all text-sm"
                                                    title="Delete employee"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {isAddModalOpen && (
                <Modal title="Add New Employee" onClose={closeAllModals}>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    value={newEmployee.firstname}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, firstname: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    value={newEmployee.lastname}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, lastname: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                value={newEmployee.email}
                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                            <input
                                type="tel"
                                value={newEmployee.phone}
                                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    value={newEmployee.gender}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value as any })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                                <select
                                    value={newEmployee.contractType}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, contractType: e.target.value as any })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                >
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                            <input
                                type="text"
                                value={newEmployee.jobTitle}
                                onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Hired</label>
                                <input
                                    type="date"
                                    value={newEmployee.dateHired}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, dateHired: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <select
                                    value={newEmployee.departmentId}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, departmentId: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={closeAllModals} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50">
                                {loading ? 'Creating...' : 'Create Employee'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Edit Employee Modal */}
            {isEditModalOpen && editEmployee && (
                <Modal title="Edit Employee" onClose={closeAllModals}>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    value={editEmployee.firstname}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, firstname: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    value={editEmployee.lastname}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, lastname: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                value={editEmployee.email}
                                onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                            <input
                                type="tel"
                                value={editEmployee.phone}
                                onChange={(e) => setEditEmployee({ ...editEmployee, phone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    value={editEmployee.gender}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, gender: e.target.value as any })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                                <select
                                    value={editEmployee.contractType}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, contractType: e.target.value as any })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                >
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                            <input
                                type="text"
                                value={editEmployee.jobTitle}
                                onChange={(e) => setEditEmployee({ ...editEmployee, jobTitle: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Hired</label>
                                <input
                                    type="date"
                                    value={editEmployee.dateHired}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, dateHired: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    value={editEmployee.departmentId || ''}
                                    onChange={(e) => setEditEmployee({ ...editEmployee, departmentId: e.target.value || null })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={closeAllModals} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50">
                                {loading ? 'Updating...' : 'Update Employee'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && employeeToDelete && (
                <Modal title="Confirm Delete" onClose={closeAllModals}>
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Are you sure you want to delete <strong>{employeeToDelete.firstname} {employeeToDelete.lastname}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={closeAllModals} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                                {loading ? 'Deleting...' : 'Delete Employee'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* View Employee Modal */}
            {isViewModalOpen && selectedEmployee && (
                <Modal title="Employee Details" onClose={closeAllModals}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{selectedEmployee.firstname} {selectedEmployee.lastname}</h3>
                                <p className="text-gray-600">{selectedEmployee.jobTitle}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-gray-900">{selectedEmployee.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                <p className="text-gray-900">{selectedEmployee.phone}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Gender</label>
                                <p className="text-gray-900">{selectedEmployee.gender}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Contract Type</label>
                                <p className="text-gray-900">{selectedEmployee.contractType}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Date Hired</label>
                                <p className="text-gray-900">{selectedEmployee.dateHired}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Department</label>
                                <p className="text-gray-900">{getDepartmentName(selectedEmployee.departmentId)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <p className="text-gray-900">{formatStatus(selectedEmployee.status)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Employee ID</label>
                                <p className="text-gray-900">EMP-{selectedEmployee.id.toString().padStart(4, '0')}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={closeAllModals} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                Close
                            </button>
                            <button onClick={() => openEditModal(selectedEmployee)} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
                                Edit
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Assign Role Modal */}
            {isAssignRoleModalOpen && selectedEmployee && (
                <Modal title="Assign Role" onClose={closeAllModals}>
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Assign a role to <strong>{selectedEmployee.firstname} {selectedEmployee.lastname}</strong>
                        </p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Role *</label>
                            <select
                                value={selectedRoleId}
                                onChange={(e) => setSelectedRoleId(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-green-500 focus:border-transparent text-black"
                            >
                                <option value="">Select a role</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={closeAllModals} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                                Cancel
                            </button>
                            <button onClick={handleAssignRole} disabled={loading || !selectedRoleId} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50">
                                {loading ? 'Assigning...' : 'Assign Role'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// Modal Component
const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 -top-6">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
                {children}
            </div>
        </div>
    );
};

export default EmployeesPage;