import { Metadata } from "next";
import LeaveTypesManager from "./LeaveTypes";
export const metadata: Metadata = {
    title: "Leave Types",
    description: "Leave Types",
};

export default function LeaveTypes() {
    return (
        <div className="max-w-5xl h-screen overflow-y-auto mx-auto p-4">
            <LeaveTypesManager />
        </div>
    );
}
