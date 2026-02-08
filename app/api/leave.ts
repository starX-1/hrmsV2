import hrmsApi from "../utils/axios";

export const createLeaveType = async (data: any) => {
    try {
        const response = await hrmsApi.post('/leave-types', data);
        return response.data;
    } catch (error) {
        console.error('Error creating leave:', error);
        throw error;
    }
}

export const fetchLeaveTypes = async (companyId: string) => {
    try {
        const response = await hrmsApi.get(`/leave-types/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching leave types:', error);
        throw error;
    }
}

export const updateLeaveType = async (leaveTypeId: string, data: any) => {
    try {
        const response = await hrmsApi.put(`/leave-types/${leaveTypeId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating leave type:', error);
        throw error;
    }
}

export const deleteLeaveType = async (leaveTypeId: any) => {
    try {
        const response = await hrmsApi.delete(`/leave/${leaveTypeId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting leave type:', error);
        throw error;
    }
}

// Placeholder API functions for leave management
export const getLeaveTypes = async () => {
    // Implementation would fetch from your backend
    return Promise.resolve([])
}

export const getLeaveApplications = async (id: any) => {
    const response = await hrmsApi.get(`/leave-requests/employee/${id}`);
    return response.data;
}

export const applyForLeave = async (data: any) => {
    const response = await hrmsApi.post('/leave-requests', data);
    return response.data;
}

export const approveLeaveRequest = async (id: any) => {
    const response = await hrmsApi.put(`/leave-requests/${id}/approve`);
    return response.data;
}

export const getDepartmentLeaveRequests = async () => {
    const response = await hrmsApi.get('/leave-requests/manager/comments');
    return response.data;
}

export const getCompanyLeaveRequests = async (companyId: any) => {
    const response = await hrmsApi.get(`/leave-requests/company/${companyId}`);
    return response.data;
}

export const processLeaveRequestDecision = async (
    requestId: number,
    data: {
        employeeId: number;
        action: 'comment' | 'reject' | 'approve';
        comment: string;
        totalDays?: number;
    }
) => {
    const response = await hrmsApi.post(`/leave-requests/${requestId}/decision`, data);
    return response.data;
}