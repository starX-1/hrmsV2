// config/sidebar.ts
export type SidebarItem = {
    label: string;
    href: string;
    permission?: string | string[];
    key?: string;
};

export type SidebarSection = {
    title: string;
    items: SidebarItem[];
};

export const sidebarConfig: SidebarSection[] = [
    {
        title: "Dashboard",
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
            },
        ],
    },
    {
        title: "Company",
        items: [
            {
                key: "companies",
                label: "Companies",
                href: "/dashboard/companies",
                permission: "view_company",
            },
        ],
    },
    {
        title: "Organization",
        items: [
            {
                key: "departments",
                label: "Departments",
                href: "/dashboard/departments",
                permission: "view_department",
            },
            {
                key: "employees",
                label: "Employees",
                href: "/dashboard/employees",
                permission: "view_employee",
            },
        ],
    },
    {
        title: "Leave Management",
        items: [
            {
                key: "leave-types",
                label: "Leave Types",
                href: "/dashboard/leave-types",
                permission: "view_leave_type",
            },
            {
                key: "leave-requests",
                label: "Leave Requests",
                href: "/dashboard/leave-requests",
                permission: "view_leave_request",
            },
            {
                key: "team-leave-requests",
                label: "Team Leave Requests",
                href: "/dashboard/leave-requests/team",
                permission: "view_team_leave_requests",
            },
            {
                key: "leave-balances",
                label: "Leave Balances",
                href: "/dashboard/leave-balances",
                permission: "manage_leave_balance",
            },
        ],
    },
    {
        title: "Access Control",
        items: [
            {
                key: "roles",
                label: "Roles",
                href: "/dashboard/roles",
                permission: "view_role",
            },
            {
                key: "permissions",
                label: "Permissions",
                href: "/dashboard/permissions",
                permission: "view_permission",
            },
            {
                key: "modules",
                label: "Modules",
                href: "/dashboard/modules",
                permission: "view_module",
            },
            {
                key: "user-roles",
                label: "User Roles",
                href: "/dashboard/user-roles",
                permission: "view_user_roles",
            },
            {
                label: "Role Permissions",
                href: "/dashboard/role-permissions",
                permission: "view_role_permissions",
            },
        ],
    },
];
