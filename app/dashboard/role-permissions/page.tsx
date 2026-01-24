import { Metadata } from "next";
import RolePermissionsManager from "./rolePermissions";
export const metadata: Metadata = {
    title: "Role Permissions",
    description: "Role Permissions",
};

export default function RolePermissions() {
    return (
        <div className="max-w-5xl h-screen overflow-y-auto mx-auto p-4">
            <RolePermissionsManager />
        </div>
    );
}
