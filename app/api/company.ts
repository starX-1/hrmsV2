import hrmsApi from "../utils/axios";

export const createCompany = async (data: any) => {
    try {
        const response = await hrmsApi.post('/companies', data);
        console.log(data);
        return response;
    } catch (error) {
        console.error('Error creating company:', error);
        throw error;
    }
}

export const getCompanies = async () => {
    try {
        const response = await hrmsApi.get('/companies');
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

export const updateCompany = async (companyId: string, data: any) => {
    try {
        const response = await hrmsApi.put(`/companies/${companyId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating company:', error);
        throw error;
    }

}
export const deleteCompany = async (companyId: string) => {
    try {
        const response = await hrmsApi.delete(`/companies/${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting company:', error);
        throw error;
    }
}