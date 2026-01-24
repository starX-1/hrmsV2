import DashboardClientLayout from "./DashboardClientLayout";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen bg-gray-50 overflow-hidden">
            <DashboardClientLayout>
                {children}
            </DashboardClientLayout>
        </div>
    );
}
