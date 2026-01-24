import { Metadata } from "next";
import EmployeesPage from "./EmployeesPage";
export const metadata: Metadata = {
    title: "Employees",
    description: "Employees",
};

export default function Employees() {
    return (
        <div className="max-w-5xl h-screen overflow-y-auto mx-auto p-4">
            <EmployeesPage />
        </div>
    );
}
