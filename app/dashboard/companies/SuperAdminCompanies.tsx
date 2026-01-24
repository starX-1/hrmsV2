'use client'
import { useEffect, useState } from 'react';
import OnboardingPage from './onBoarding';
import { Building, Search, Filter, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, MoreVertical, ChevronRight, Users, Calendar, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { getCompanies } from '@/app/api/company';

interface Company {
    id: number;
    name: string;
    address: string;
    email: string;
    phone: string;
    countryCode: string;
    createdAt: string;
    updatedAt: string;
    status?: 'active' | 'pending' | 'suspended'; // Added status field for UI
    employees?: number; // Added for stats display
}

export default function SuperAdminCompanies() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await getCompanies();
            console.log('API Response:', response);

            // Transform API data to include additional fields for UI
            const transformedCompanies = response.companies.map((company: Company) => ({
                ...company,
                status: 'active', // Default status since API doesn't provide it
                employees: Math.floor(Math.random() * 500) + 10, // Mock employee count
            }));

            setCompanies(transformedCompanies);
        } catch (error: any) {
            setError('Failed to fetch companies');
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteCompany = async (id: number) => {
        if (confirm('Are you sure you want to delete this company?')) {
            try {
                // TODO: Add delete API call here
                // await deleteCompany(id);
                setCompanies(companies.filter((company) => company.id !== id));
            } catch (error) {
                alert('Failed to delete company');
            }
        }
    };

    const handleStatusToggle = (id: number) => {
        setCompanies(companies.map((company) => {
            if (company.id === id) {
                const newStatus = company.status === 'active' ? 'suspended' : 'active';
                return { ...company, status: newStatus };
            }
            return company;
        }));
    };

    const getStatusColor = (status: string = 'active') => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'suspended':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string = 'active') => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4" />;
            case 'pending':
                return <Eye className="w-4 h-4" />;
            case 'suspended':
                return <XCircle className="w-4 h-4" />;
            default:
                return null;
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

    const handleCancelOnboarding = () => {
        setShowOnboarding(false);
    };

    const stats = {
        total: companies.length,
        active: companies.filter((c) => c.status === 'active').length,
        pending: companies.filter((c) => c.status === 'pending').length,
        totalEmployees: companies.reduce((sum, company) => sum + (company.employees || 0), 0)
    };

    if (showOnboarding) {
        return <OnboardingPage onCancel={handleCancelOnboarding} />;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading companies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-screen overflow-y-auto p-4">
            {/* Header with Add Company Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Companies Management</h2>
                    <p className="text-gray-600 mt-1">Manage all registered companies in the system</p>
                </div>
                <button
                    onClick={() => setShowOnboarding(true)}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Onboard New Company
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Companies</p>
                            <p className="text-2xl font-bold mt-1">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active</p>
                            <p className="text-2xl font-bold mt-1">{stats.active}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold mt-1">{stats.pending}</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Eye className="w-5 h-5 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Employees</p>
                            <p className="text-2xl font-bold mt-1">{stats.totalEmployees.toLocaleString()}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search companies by name, email, address, or phone..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Companies Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Country
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employees
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
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
                            {filteredCompanies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center mr-3 border border-green-100">
                                                <Building className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{company.name}</div>
                                                <div className="text-sm text-gray-500">ID: {company.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Mail className="w-3 h-3 mr-2 text-gray-400" />
                                                {company.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Phone className="w-3 h-3 mr-2 text-gray-400" />
                                                {company.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                                            <span className="text-sm text-gray-900 truncate max-w-[150px]">
                                                {company.address}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Globe className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                                {company.countryCode}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                                            <span className="font-medium">{company.employees?.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className={`px-3 py-1 text-sm rounded-full flex items-center ${getStatusColor(company.status)}`}>
                                                {getStatusIcon(company.status)}
                                                <span className="ml-1 capitalize">{company.status}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{formatDate(company.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setSelectedCompany(company)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusToggle(company.id)}
                                                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${company.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                                title={company.status === 'active' ? 'Suspend Company' : 'Activate Company'}
                                            >
                                                {company.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => {/* TODO: Handle edit */ }}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
                                                title="Edit Company"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCompany(company.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-red-600 hover:text-red-800 transition-colors"
                                                title="Delete Company"
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

                {/* Empty State */}
                {filteredCompanies.length === 0 && (
                    <div className="text-center py-12">
                        <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm ? 'Try adjusting your search term' : 'Get started by adding your first company'}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowOnboarding(true)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Onboard First Company
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Company Details Modal */}
            {selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center mr-4 border border-green-100">
                                        <Building className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{selectedCompany.name}</h3>
                                        <p className="text-gray-600">ID: {selectedCompany.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCompany(null)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">{selectedCompany.email}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">{selectedCompany.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <div className="flex items-start">
                                            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                                            <span className="text-gray-900">{selectedCompany.address}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Details</label>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Country Code:</span>
                                                <span className="text-gray-900">{selectedCompany.countryCode}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Employees:</span>
                                                <span className="text-gray-900">{selectedCompany.employees?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(selectedCompany.status)}`}>
                                                {getStatusIcon(selectedCompany.status)}
                                                <span className="ml-1 capitalize">{selectedCompany.status}</span>
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Updated: {formatDate(selectedCompany.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setSelectedCompany(null)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <div className="space-x-3">
                                        <button
                                            onClick={() => {
                                                handleStatusToggle(selectedCompany.id);
                                                setSelectedCompany(null);
                                            }}
                                            className={`px-4 py-2 rounded-lg transition-colors ${selectedCompany.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                                        >
                                            {selectedCompany.status === 'active' ? 'Suspend Company' : 'Activate Company'}
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Send Login Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}