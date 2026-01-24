import { ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react';
import Link from "next/link";

const CTA = () => {
    const benefits = [
        "14-day free trial",
        "No credit card required",
        "Cancel anytime",
        "24/7 support"
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background Gradient - changed from blue to green */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-800 to-green-900" />

            {/* Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                        <Zap className="w-4 h-4 mr-2 text-white" />
                        <span className="text-sm font-medium text-white">
                            Limited Time Offer
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your HR Management?
                    </h2>

                    {/* Subheading */}
                    <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of companies that trust HRMS Pro to streamline their HR processes.
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center text-white">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            href="/onboarding"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-medium bg-white text-green-700 hover:bg-gray-100 transition-all group"
                        >
                            Start Your Free Trial
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#pricing"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-medium text-white border-2 border-white hover:bg-white hover:text-green-700 transition-all"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            Compare Plans
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                        <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="text-2xl font-bold text-white">30,000+</div>
                            <div className="text-sm text-green-100">Active Users</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="text-2xl font-bold text-white">500+</div>
                            <div className="text-sm text-green-100">Companies</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="text-2xl font-bold text-white">99.9%</div>
                            <div className="text-sm text-green-100">Uptime</div>
                        </div>
                        <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="text-2xl font-bold text-white">4.9/5</div>
                            <div className="text-sm text-green-100">Rating</div>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-12 flex items-center justify-center text-green-100">
                        <Shield className="w-5 h-5 mr-2" />
                        <span className="text-sm">Enterprise-grade security & GDPR compliant</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;