"use client";

import Sidebar from "../components/SideBar";
import { useAuth } from "../utils/authContext";
import { Providers } from "../utils/providers";

export default function DashboardClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const { user } = useAuth();

    // console.log("DashboardClientLayout user:", user);

    // const userPermissions = user?.permissions ?? [];

    return (
        <div className="flex h-full">
            <Providers>
                <Sidebar />
                <main className="flex-1 p-6 overflow-y-auto h-full">{children}</main>
            </Providers>
        </div>
    );
}
