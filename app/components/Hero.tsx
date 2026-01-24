'use client'

import { motion } from "framer-motion";
import { ArrowRight, Shield, Users, BarChart3, CheckCircle } from 'lucide-react';
import Link from "next/link";
import openEmailForOnboarding from '../utils/mail';
const Hero = () => {
    const benefits = [
        "No credit card required",
        "14-day free trial",
        "Cancel anytime",
        "24/7 support"
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <section className="relative overflow-hidden pt-12 md:pt-24 pb-16 md:pb-32">
                {/* Background Gradient - changed from blue to green */}
                <div className="absolute inset-0 bg-gradient-to-b from-green-50 via-white to-white" />

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <motion.div variants={itemVariants}>
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 mb-6">
                                <Shield className="w-4 h-4 mr-2" style={{ color: '#1a462b' }} />
                                <span className="text-sm font-medium" style={{ color: '#1a462b' }}>
                                    Trusted by 500+ companies
                                </span>
                            </div>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div variants={itemVariants}>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="block text-gray-900">Modern HR Management</span>
                                <span className="block" style={{ color: '#1a462b' }}>Made Simple</span>
                            </h1>
                        </motion.div>

                        {/* Subheading */}
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Streamline your HR processes, manage employees efficiently, and focus on what matters most - your people.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <button
                                onClick={() => openEmailForOnboarding()}
                                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-medium text-white transition-all hover:opacity-90 group"
                                style={{ backgroundColor: '#1a462b' }}
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link
                                href="#features"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-medium text-gray-700 border-2 border-gray-300 hover:border-green-700 hover:text-green-700 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                Watch Demo
                            </Link>
                        </div>

                        {/* Benefits */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center text-gray-600">
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    <span className="text-sm font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3" style={{ backgroundColor: '#1a462b' + '20' }}>
                                    <Users className="w-6 h-6" style={{ color: '#1a462b' }} />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">50K+</div>
                                <div className="text-sm text-gray-600">Employees Managed</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3" style={{ backgroundColor: '#15803d' + '20' }}>
                                    <svg className="w-6 h-6" style={{ color: '#15803d' }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">85%</div>
                                <div className="text-sm text-gray-600">Time Saved</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3" style={{ backgroundColor: '#ca8a04' + '20' }}>
                                    <Shield className="w-6 h-6" style={{ color: '#ca8a04' }} />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">99.9%</div>
                                <div className="text-sm text-gray-600">Uptime SLA</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3" style={{ backgroundColor: '#b91c1c' + '20' }}>
                                    <BarChart3 className="w-6 h-6" style={{ color: '#b91c1c' }} />
                                </div>
                                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                                <div className="text-sm text-gray-600">Customer Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Hero;