import { Users, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import Link from "next/link";

const Footer = () => {
    const productLinks = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' }
    ];

    const resourceLinks = [
        { label: 'Documentation', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'API Reference', href: '#' }
    ];

    const companyLinks = [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Legal', href: '#' }
    ];

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Mail, href: '#', label: 'Email' }
    ];

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: '#1a462b' }}> {/* Changed color */}
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xl font-bold">HRMS</span>
                                <span className="text-xl font-bold text-gray-300">Pro</span>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Modern HR management platform designed to streamline your workforce operations and boost productivity.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {productLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {resourceLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="border-t border-gray-800 pt-8 mb-8">
                    <div className="max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and tips.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-r-lg font-medium text-white transition-all hover:opacity-90"
                                style={{ backgroundColor: '#1a462b' }}
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} HRMS Pro. All rights reserved.
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Cookie Policy
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            GDPR
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;