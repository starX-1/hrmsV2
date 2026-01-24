import hrmsApi from "../utils/axios";

export const createEmployee = async (data: any) => {
    try {
        const response = await hrmsApi.post('/employees', data);
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
}

export const getAllEmployees = async () => {
    try {
        const response = await hrmsApi.get('/employees');
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
}

export const getCompanyEmployees = async (companyId: string) => {
    try {
        const response = await hrmsApi.get(`/employees/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching company employees:', error);
        throw error;
    }
}

export const updateEmployee = async (employeeId: string, data: any) => {
    try {
        const response = await hrmsApi.put(`/employees/${employeeId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
}

export const deleteEmployee = async (employeeId: string) => {
    try {
        const response = await hrmsApi.delete(`/employees/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
}

export const getDepartmentEmployees = async (departmentId: string) => {
    try {
        const response = await hrmsApi.get(`/departments/${departmentId}/employees`);
        return response.data;
    } catch (error) {
        console.error('Error fetching department employees:', error);
        throw error;
    }
}

export const getEmployeeById = async (employeeId: string) => {
    try {
        const response = await hrmsApi.get(`/employees/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        throw error;
    }
}

// Placeholder API functions for employee
export const getEmployeeProfile = async () => {
    // Implementation would fetch from your backend
    return Promise.resolve({})
}

export const updateEmployeeProfile = async (data: any) => {
    // Implementation would update in your backend
    return Promise.resolve({})
}