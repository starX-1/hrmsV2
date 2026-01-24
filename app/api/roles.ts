import hrmsApi from "../utils/axios";

export const createRole = async (data: any) => {
    try {
        const response = await hrmsApi.post('/roles', data);
        return response.data;
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
}

export const updateRole = async (roleId: string | number, data: any) => {
    try {
        const response = await hrmsApi.put(`/roles/${roleId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating role:', error);
        throw error;
    }
}

export const deleteRole = async (roleId: string | number) => {
    try {
        const response = await hrmsApi.delete(`/roles/${roleId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting role:', error);
        throw error;
    }
}

export const getAllRolesByCompanyId = async (companyId: string | number) => {
    try {
        const response = await hrmsApi.get(`/companies/${companyId}/roles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
}

export const assignUserToRole = async (data: any) => {
    try {
        const response = await hrmsApi.post('/user-roles', data);
        return response.data;
    } catch (error) {
        console.error('Error assigning user to role:', error);
        throw error;
    }
}

export const assignAdminRole = async (data: any) => {
    try {
        const response = await hrmsApi.post('/user-roles', { roleId: 6, ...data });
        return response.data;
    } catch (error) {
        console.error('Error assigning admin role:', error);
        throw error;
    }
}

// permissions 
export const getAllPermissions = async () => {
    try {
        const response = await hrmsApi.get('/permissions');
        return response.data;
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw error;
    }
}

export const getCompanyRoles = async (companyId: string | number) => {
    try {
        const response = await hrmsApi.get(`/roles/company/${companyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching company roles:', error);
        throw error;
    }
}


export const createRolePermission = async (data: any) => {
    try {
        const response = await hrmsApi.post('/role-permissions', data);
        return response.data;
    } catch (error) {
        console.error('Error creating role permission:', error);
        throw error;
    }
}

export const getRolePermissions = async (roleId: string | number) => {
    try {
        const response = await hrmsApi.get(`/role-permissions/role/${roleId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching role permissions:', error);
        throw error;
    }
}

export const deleteRolePermission = async (rolePermissionId: string) => {
    try {
        const response = await hrmsApi.delete(`/role-permissions/remove/${rolePermissionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting role permission:', error);
        throw error;
    }
}

export const createModule = async (data: any) => {
    try {
        const response = await hrmsApi.post('/modules', data);
        return response.data;
    } catch (error) {
        console.error('Error creating module:', error);
        throw error;
    }
}


export const getModules = async () => {
    try {
        const response = await hrmsApi.get('/modules');
        return response.data;
    } catch (error) {
        console.error('Error fetching modules:', error);
        throw error;
    }
}

export const getModulePermissions = async (moduleId: string) => {
    try {
        const response = await hrmsApi.get(`/modules/${moduleId}/permissions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching module permissions:', error);
        throw error;
    }

}

export const assignModulePermission = async (data: any) => {
    try {
        const response = await hrmsApi.post('/permissions', data);
        return response.data;
    } catch (error) {
        console.error('Error assigning module permission:', error);
        throw error;
    }
}

export const getPermissions = async () => {
    try {
        const response = await hrmsApi.get('/permissions');
        return response.data;
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw error;
    }
}

export const assignPermissionToRole = async (roleId: string | number, permissionId: string | number) => {
    try {
        const response = await hrmsApi.post(`/roles/${roleId}/permissions`, { permissionId });
        return response.data;
    } catch (error) {
        console.error('Error assigning permission to role:', error);
        throw error;
    }
}

export const removePermissionFromRole = async (roleId: string | number, permissionId: string | number) => {
    try {
        const response = await hrmsApi.delete(`/roles/${roleId}/permissions/${permissionId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing permission from role:', error);
        throw error;
    }
}

