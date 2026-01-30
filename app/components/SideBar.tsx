"use client";

import Link from "next/link";
import { sidebarConfig } from "../config/sidebar";
import { canAccessMenu } from "../utils/authorization";
import { useAuth } from "../utils/authContext";
import { useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";

const Sidebar = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const roles = user?.roles ?? [];
    const permissions =
        user?.permissions ??
        user?.roles?.flatMap((r: any) =>
            r.role?.rolePermissions?.map((rp: any) => rp.permission?.name)
        ) ??
        [];

    const toggleSection = (title: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.removeItem('userRole');
        signOut({ callbackUrl: '/login' });
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-emerald-600 text-white shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 bg-[#1a462b] border-r border-emerald-100 h-screen 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                shadow-xl lg:shadow-lg
            `}>
                {/* Logo/Header */}
                <div className="p-6 border-b border-emerald-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">HR</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-white">
                                HRMS Pro
                            </h2>
                            <p className="text-xs text-emerald-500 font-medium">Management System</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-emerald-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-white truncate">
                                {roles.map((r: any) => r.role?.name).join(', ') || 'No Role'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-200px)]">
                    {sidebarConfig.map(section => {
                        const visibleItems = section.items.filter((item: any) =>
                            canAccessMenu(
                                roles,
                                permissions,
                                item.key,
                                item.permission
                            )
                        );

                        if (visibleItems.length === 0) return null;

                        const isExpanded = expandedSections[section.title] ?? true;

                        return (
                            <div key={section.title} className="space-y-2">
                                <button
                                    onClick={() => toggleSection(section.title)}
                                    className="flex items-center justify-between w-full text-left"
                                >
                                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                                        {section.title}
                                    </h4>
                                    <ChevronRight
                                        size={16}
                                        className={`text-emerald-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                    />
                                </button>

                                {isExpanded && (
                                    <ul className="space-y-1 ml-1">
                                        {visibleItems.map(item => (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`
                                                        flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm
                                                        transition-all duration-200 group
                                                        hover:bg-emerald-50 hover:shadow-sm hover:border-l-4 hover:border-l-emerald-500 hover:pl-2.5
                                                        text-white hover:text-emerald-800
                                                        relative overflow-hidden
                                                    `}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 group-hover:bg-emerald-500 transition-colors"></div>
                                                    <span className="font-medium">{item.label}</span>
                                                    <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-transparent text-white">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-white font-medium">
                            {/* logout button */}
                            <button
                                onClick={handleLogout}
                                className="text-xs text-white font-medium hover:text-emerald-300">
                                Logout
                            </button>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
                />
            )}
        </>
    );
};

export default Sidebar;