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
    menuKey: string,
    requiredPermission?: string | string[]
): boolean => {
    // ✅ SPECIAL CASE: Restricted pages (Companies, Roles, Permissions) → super_admin ONLY
    const restrictedPages = ["companies", "roles", "permissions"];
    if (restrictedPages.includes(menuKey)) {
        return isSuperAdmin(roles);
    }

    // ✅ SPECIAL CASE: admin → Can see ALL other pages
    if (isAdmin(roles)) {
        return true;
    }

    // Standard permission-based access
    if (!requiredPermission) return true;

    if (Array.isArray(requiredPermission)) {
        return requiredPermission.some(p => permissions.includes(p));
    }

    return permissions.includes(requiredPermission);
};
