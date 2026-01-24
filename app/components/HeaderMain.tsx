'use client'
import { useState } from "react";
import { Menu, X, Users, Shield } from 'lucide-react';
import Link from "next/link";
import openEmailForOnboarding from "../utils/mail";
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1a462b' }}>
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold" style={{ color: '#1a462b' }}>HRMS</span>
                                <span className="text-xl font-bold text-gray-900">Pro</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-gray-700 hover:text-green-700 transition-colors font-medium"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/authPages/login"
                            className="px-4 py-2 text-gray-700 font-medium hover:text-green-700 transition-colors"
                        >
                            Sign In
                        </Link>
                        <button
                            onClick={openEmailForOnboarding}
                            className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: '#1a462b' }}
                        >
                            Get Started Free
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-gray-700 hover:text-green-700 transition-colors font-medium py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="pt-4 space-y-3">
                                <Link
                                    href="/authPages/login"
                                    className="block text-center py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:border-green-700 hover:text-green-700 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <button
                                    onClick={() => {
                                        openEmailForOnboarding();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full text-center py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                                    style={{ backgroundColor: '#1a462b' }}
                                >
                                    Get Started Free
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;