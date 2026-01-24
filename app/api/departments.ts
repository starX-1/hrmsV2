import hrmsApi from "../utils/axios";

export const createDepartment = async (data: any) => {
    try {
        const response = await hrmsApi.post('/departments', data);
        return response.data;
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
}

export const getAllCompanyDepartments = async (companyId: string) => {
    try {
        const response = await hrmsApi.get(`/departments/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
}

export const getDepartmentById = async (departmentId: string) => {
    try {
        const response = await hrmsApi.get(`/departments/${departmentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching department by ID:', error);
        throw error;
    }
}

export const updateDepartment = async (departmentId: string, data: any) => {
    try {
        const response = await hrmsApi.put(`/departments/${departmentId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
}

export const deleteDepartment = async (departmentId: string) => {
    try {
        const response = await hrmsApi.delete(`/departments/${departmentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
}