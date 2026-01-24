import { Metadata } from "next";
import SuperAdminCompanies from "./SuperAdminCompanies";
export const metadata: Metadata = {
    title: "Companies",
    description: "Companies",
};

export default function Companies() {
    return (
        <div className="max-w-5xl h-screen overflow-y-auto mx-auto p-4">
            <SuperAdminCompanies />
        </div>
    );
}
