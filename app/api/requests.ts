import hrmsApi from "../utils/axios";

export const approveLeaveRequest = async (requestId: any, data: any) => {
    try {
        const response = await hrmsApi.post(`/leave-requests/${requestId}/decision`, data);
        return response.data;
    } catch (error) {
        console.error('Error approving leave request:', error);
        throw error;
    }
}
export const getPendingLeaveRequests = async (id: string) => {
    try {
        const response = await hrmsApi.get(`/leave-requests/company/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending leave requests:', error);
        throw error;
    }
}   
