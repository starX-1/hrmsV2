'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Search,
    Filter,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDown,
    Users,
    CalendarDays,
    AlertCircle,
    Eye,
    Download,
    MoreVertical
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getCompanyLeaveRequests, processLeaveRequestDecision } from '@/app/api/leave';
import { useAuth } from '@/app/utils/authContext';

interface LeaveRequest {
    id: number;
    employeeId: number;
    leaveTypeId: number;
    startDate: string;
    endDate: string;
    totalDays: number | null;
    reason: string;
    status: string;
    managerComment: string | null;
    createdAt: string;
    employee: {
        id: number;
        user: {
            firstname: string;
            lastname: string;
            email: string;
            imageUrl: string;
        };
        department: {
            name: string; // Note: The API response shows 'departmentId' but existing types often assume populated department.
            // Based on the user provided JSON, 'departmentId' is in employee, but `department` object is NOT in the employee object in the JSON provided?
            // WAIT. The user JSON for company requests has `employee` -> `departmentId: 3`. It DOES NOT have `department: { name: ... }`.
            // However, `TeamLeaveRequestsPage` uses `req.employee.department.name`.
            // I should check if the backend populates department for company requests.
            // The user prompt JSON shows:
            // "employee": { "id": 50, ..., "departmentId": 3, ... }
            // It does NOT show "department": { "name": ... }.
            // This means I might not have department name directly if the backend doesn't populate it.
            // Visualizing the JSON again:
            /*
              "employee": {
                  "id": 50,
                  "userId": 57,
                  "departmentId": 3,
                  ...
              }
            */
            // If `department` is missing, I should handle it safely.
            // Or maybe I should fetch departments to map IDs?
            // For now, I will use optional chaining or a placeholder if department is missing.
            // Actually, checking `TeamLeaveRequestsPage`, it uses `req.employee.department.name`.
            // If the API for company requests is different (as shown in the prompt), I need to be careful.
            // I'll assume for now I might need to just show ID or nothing if name is missing, or maybe the prompt JSON was just an example and real response might have it if the backend is consistent.
            // But the prompt explicitly said "the requests for the company from this endpoint looks like this".
            // So I should expect `departmentId` inside employee.
        };
    };
    leaveType: {
        name: string;
    };
}

// Helper to handle potential missing department name
const getDepartmentName = (req: any) => {
    return req.employee?.department?.name || `Dept ID: ${req.employee?.departmentId || 'N/A'}`;
};

export default function CompanyLeaveRequestsPage() {
    const { user } = useAuth() as { user: any };
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [action, setAction] = useState('approve'); // Default to approve for HR
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
    });

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchRequests = async () => {
        if (!user?.companyId) return;

        setIsLoading(true);
        try {
            const response = await getCompanyLeaveRequests(user.companyId);
            const data = response.leaveRequests || (Array.isArray(response) ? response : []);
            setRequests(data);

            const pending = data.filter((req: LeaveRequest) => req.status.toLowerCase() === 'pending').length;
            const approved = data.filter((req: LeaveRequest) => req.status.toLowerCase() === 'approved').length;
            const rejected = data.filter((req: LeaveRequest) => req.status.toLowerCase() === 'rejected').length;
            setStats({
                pending,
                approved,
                rejected,
                total: data.length
            });
        } catch (error) {
            console.error('Error fetching company requests:', error);
            toast.error('Failed to load company leave requests');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user?.companyId]);

    const handleOpenModal = (request: LeaveRequest) => {
        setSelectedRequest(request);
        setComment(request.managerComment || '');
        setAction('approve'); // Default
        setIsCommentModalOpen(true);
    };

    const handleSubmitDecision = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        setIsSubmitting(true);
        try {
            // endpoint: processLeaveRequestDecision(requestId, { employeeId, action, comment })
            await processLeaveRequestDecision(selectedRequest.id, {
                employeeId: selectedRequest.employeeId,
                action: action as 'approve' | 'reject' | 'comment',
                comment
            });
            toast.success(`Request ${action}d successfully`);
            setIsCommentModalOpen(false);
            fetchRequests();
        } catch (error: any) {
            console.error('Error processing request:', error);
            toast.error(error?.response?.data?.message || 'Failed to process request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return <CheckCircle2 className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            default: return null;
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.employee.user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.employee.user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.leaveType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getDepartmentName(req).toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || req.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Leave Requests</h1>
                            <p className="text-gray-600">Overview of all leave requests across the company</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Requests</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <CalendarDays className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Approved</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Rejected</p>
                                    <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 w-full md:w-64 p-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by employee, department, or leave type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Filter Dropdown */}
                        <div className="p-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:outline-none focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-white text-gray-900 cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
                            <span className="text-sm text-gray-600">
                                {filteredRequests.length} of {requests.length} requests
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600 font-medium">Loading requests...</p>
                                <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
                            </div>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CalendarDays className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'No company leave requests found'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Employee</th>
                                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Leave Type</th>
                                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Dates</th>
                                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Duration</th>
                                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                                        {req.employee.user.imageUrl && !req.employee.user.imageUrl.includes('gravatar') ? (
                                                            <img
                                                                src={req.employee.user.imageUrl}
                                                                alt={req.employee.user.firstname}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="font-bold text-gray-700">
                                                                {req.employee.user.firstname[0]}{req.employee.user.lastname[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {req.employee.user.firstname} {req.employee.user.lastname}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {getDepartmentName(req)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{req.leaveType.name}</div>
                                                <div className="text-sm text-gray-600 line-clamp-1 max-w-xs" title={req.reason}>
                                                    {req.reason}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-700">
                                                        {formatDate(req.startDate)}
                                                    </div>
                                                    <div className="text-sm text-gray-700">
                                                        {formatDate(req.endDate)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    {req.totalDays} day{req.totalDays !== 1 ? 's' : ''}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(req.status)}`}>
                                                    {getStatusIcon(req.status)}
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(req)}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                                    >
                                                        Review
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

                {/* Footer Info */}
                {filteredRequests.length > 0 && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{filteredRequests.length}</span> of{' '}
                            <span className="font-semibold text-gray-900">{requests.length}</span> requests
                        </p>
                    </div>
                )}
            </div>

            {/* Decision Modal */}
            {isCommentModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 transition-opacity duration-200"
                        onClick={() => !isSubmitting && setIsCommentModalOpen(false)}
                    ></div>

                    <div className="relative bg-white max-h-[90vh] overflow-y-auto flex flex-col rounded-xl w-full max-w-md mx-auto transform transition-all duration-200 shadow-2xl">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Review Request</h3>
                                <p className="text-sm text-gray-500">Approve or reject this leave request</p>
                            </div>
                            <button
                                onClick={() => setIsCommentModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={isSubmitting}
                            >
                                <XCircle className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitDecision} className="flex flex-col flex-1 min-h-0">
                            <div className="p-6 overflow-y-auto">
                                {/* Request Preview */}
                                <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                            <span className="font-bold text-gray-700">
                                                {selectedRequest.employee.user.firstname[0]}{selectedRequest.employee.user.lastname[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {selectedRequest.employee.user.firstname} {selectedRequest.employee.user.lastname}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {getDepartmentName(selectedRequest)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-1">Leave Type</div>
                                            <div className="font-medium text-gray-900">{selectedRequest.leaveType.name}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-1">Duration</div>
                                            <div className="font-medium text-gray-900">
                                                {selectedRequest.totalDays} day{selectedRequest.totalDays !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="text-xs font-medium text-gray-500 mb-1">Dates</div>
                                        <div className="text-sm text-gray-700">
                                            {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="text-xs font-medium text-gray-500 mb-1">Reason</div>
                                        <div className="text-sm text-gray-700 italic">
                                            "{selectedRequest.reason}"
                                        </div>
                                    </div>
                                </div>

                                {/* Action Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Decision
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setAction('approve')}
                                            className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${action === 'approve'
                                                ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAction('reject')}
                                            className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${action === 'reject'
                                                ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>

                                {/* Comment Input */}
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                        Comment <span className="text-gray-400 font-normal">(Optional)</span>
                                    </label>
                                    <textarea
                                        id="comment"
                                        rows={3}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:outline-none focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                                        placeholder="Add a note (e.g., 'Enjoy your vacation!' or rejection reason)"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        disabled={isSubmitting}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl flex-none">
                                <button
                                    type="button"
                                    onClick={() => setIsCommentModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {action === 'approve' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            {action === 'approve' ? 'Approve Request' : 'Reject Request'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
