import hrmsApi from "../utils/axios";
export const creaeteCompanyAdmin = async (data: any) => {
    try {
        const response = await hrmsApi.post('/employees', data);
        return response.data;
    } catch (error) {
        console.error('Error creating company admin:', error);
        throw error;
    }
}


export const getAllCompanyAdmins = async () => {
    try {
        const response = await hrmsApi.get('/admin');
        return response.data;
    } catch (error) {
        console.error('Error fetching company admins:', error);
        throw error;
    }
}