import { Metadata } from "next";
import RolesPage from "./User-Roles";
export const metadata: Metadata = {
    title: "Roles",
    description: "Roles",
};

export default function Roles() {
    return (
        <div className="max-w-5xl h-screen overflow-y-auto mx-auto p-4">
            <RolesPage />
        </div>
    );
}
