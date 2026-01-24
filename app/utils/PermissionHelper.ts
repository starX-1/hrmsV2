// utils/permissions.ts
export const hasPermission = (
    userPermissions: string[],
    required: string | string[]
): boolean => {
    if (Array.isArray(required)) {
        return required.some(p => userPermissions.includes(p));
    }
    return userPermissions.includes(required);
};
