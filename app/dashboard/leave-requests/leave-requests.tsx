'use client'

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';
import { useAuth } from '@/app/utils/authContext';
import { toast } from 'react-toastify';
import { getLeaveApplications, applyForLeave, fetchLeaveTypes } from '@/app/api/leave';

interface LeaveType {
    id: number;
    name: string;
}

interface LeaveRequest {
    id: number;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected' | string;
    reason: string;
    totalDays: number | null;
    createdAt: string;
    leaveType: {
        name: string;
    };
}

const LeaveRequestsPage = () => {
    const { user, isLoading: authLoading } = useAuth() as { user: any, isLoading: boolean };
    const employeeProfile = user?.employeeProfile?.[0];
    const employeeId = employeeProfile?.id;
    const companyId = user?.companyId;
    const departmentId = employeeProfile?.departmentId;

    useEffect(() => {
        console.log("LeaveRequestsPage - Auth State:", { user, employeeId, companyId, authLoading });
    }, [user, employeeId, companyId, authLoading]);

    const [applications, setApplications] = useState<LeaveRequest[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        if (employeeId) {
            fetchData();
        } else if (!authLoading) {
            console.warn("LeaveRequestsPage - No employeeId found after auth loaded");
            setIsLoading(false);
        }
    }, [employeeId, companyId, authLoading]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            console.log("LeaveRequestsPage - Fetching data for employeeId:", employeeId);
            const [appsResponse, typesResponse] = await Promise.all([
                getLeaveApplications(employeeId),
                companyId ? fetchLeaveTypes(companyId) : Promise.resolve({ leaveTypes: [] })
            ]);

            console.log("LeaveRequestsPage - API Responses:", {
                apps: appsResponse,
                types: typesResponse
            });

            // Set applications - handle both { leaveRequests: [] } and direct array if applicable
            const requests = appsResponse.leaveRequests || (Array.isArray(appsResponse) ? appsResponse : []);
            setApplications(requests);

            setLeaveTypes(typesResponse.leaveTypes || (Array.isArray(typesResponse) ? typesResponse : []));
        } catch (error: any) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load leave data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!employeeId) {
            toast.error('User not authenticated');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                employeeId: String(employeeId),
                leaveTypeId: Number(formData.leaveTypeId),
                startDate: formData.startDate,
                endDate: formData.endDate,
                approvingDepartmentId: Number(departmentId),
                reason: formData.reason
            };

            await applyForLeave(payload);
            toast.success('Leave application submitted successfully!');
            setIsModalOpen(false);
            setFormData({
                leaveTypeId: '',
                startDate: '',
                endDate: '',
                reason: ''
            });
            fetchData(); // Refresh list
        } catch (error: any) {
            console.error('Error applying for leave:', error);
            const msg = error?.response?.data?.message || 'Failed to submit application';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return <CheckCircle2 className="w-4 h-4 mr-1" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 mr-1" />;
            case 'pending':
                return <Clock className="w-4 h-4 mr-1" />;
            default:
                return <AlertCircle className="w-4 h-4 mr-1" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leave Applications</h1>
                    <p className="text-gray-600">Track and manage your time off requests</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-[#1a462b] text-white rounded-lg hover:bg-[#143621] transition-all shadow-sm hover:shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Apply for Leave
                </button>
            </div>

            {/* Main content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-semibold text-gray-800 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-green-600" />
                        Application History
                    </h2>
                </div>

                {isLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center space-y-3">
                        <div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Loading applications...</p>
                    </div>
                ) : applications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Type</th>
                                    <th className="px-6 py-4 font-semibold">Duration</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Submitted On</th>
                                    <th className="px-6 py-4 font-semibold">Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{app.leaveType?.name || 'Leave'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">
                                                {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {app.totalDays ? `${app.totalDays} days` : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 max-w-xs truncate" title={app.reason}>
                                                {app.reason}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No leave applications found</h3>
                        <p className="text-gray-500 mt-1 mb-6">You haven&#39;t submitted any leave requests yet.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center text-green-700 font-semibold hover:underline"
                        >
                            Submit your first application <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                )}
            </div>

            {/* Application Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-900">Apply for Leave</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                <select
                                    name="leaveTypeId"
                                    value={formData.leaveTypeId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black"
                                >
                                    <option value="">Select leave type</option>
                                    {leaveTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <textarea
                                    name="reason"
                                    rows={3}
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    placeholder="Explain the reason for your leave request..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none text-black"
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-2 py-2 px-6 bg-[#1a462b] text-white font-medium rounded-lg hover:bg-[#143621] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Submitting...
                                        </>
                                    ) : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequestsPage;
