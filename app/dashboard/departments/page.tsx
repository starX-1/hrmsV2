import { Metadata } from "next";
import DepartmentsPage from "./departmentsPage";
export const metadata: Metadata = {
    title: "Departments",
    description: "Departments",
};

export default function Departments() {
    return (
        <div className="max-w-5xl h-screen overflow-y-auto mx-auto p-4">
            <DepartmentsPage />
        </div>
    );
}
