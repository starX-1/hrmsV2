// utils/authorization.ts
export const isSuperAdmin = (roles: any[] = []) => {
    return roles.some(r => r.role?.name === "super_admin");
};

export const isAdmin = (roles: any[] = []) => {
    return roles.some(r => r.role?.name === "admin");
};

export const canAccessMenu = (
    roles: any[] = [],
    permissions: string[] = [],
    menuKey?: string,
    requiredPermission?: string | string[]
): boolean => {
    // ✅ 1. Always allow generic items (e.g., Dashboard which has no key)
    if (!menuKey) return true;

    // ✅ 2. SUPER ADMIN: Only Dashboard & Companies
    if (isSuperAdmin(roles)) {
        return ["companies"].includes(menuKey);
    }

    // ✅ 3. ADMIN: Only Dashboard, Depts, Employees, Leave Types, User Roles, Role Permissions
    if (isAdmin(roles)) {
        const adminAllowed = [
            "departments",
            "employees",
            "leave-types",
            "user-roles",
            "role-permissions"
        ];
        return adminAllowed.includes(menuKey);
    }

    // ✅ 4. OTHER USERS: Strict Permission Check
    if (!requiredPermission) return true; // Allow if no permission defined (unless we want strict deny)

    if (Array.isArray(requiredPermission)) {
        return requiredPermission.some(p => permissions.includes(p));
    }

    return permissions.includes(requiredPermission);
};
