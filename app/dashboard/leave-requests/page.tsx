import { Metadata } from "next";
import LeaveRequestsPage from "./leave-requests";

export const metadata: Metadata = {
    title: "Leave Requests | HRMS Pro",
    description: "Manage and track your leave applications",
};

export default function Page() {
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
            <LeaveRequestsPage />
        </div>
    );
}
