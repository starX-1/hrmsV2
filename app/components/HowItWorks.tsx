'use client'
import { useState } from "react";
import { UserPlus, Settings, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "Sign Up & Onboard",
            description: "Create your company account and complete the guided onboarding process.",
            icon: UserPlus,
            color: '#1a462b', // Changed from blue
            duration: "2 minutes"
        },
        {
            title: "Configure Settings",
            description: "Customize your HR policies, workflows, and permission structures.",
            icon: Settings,
            color: '#15803d', // Changed from bright green
            duration: "5 minutes"
        },
        {
            title: "Invite Team Members",
            description: "Add your employees and assign roles with appropriate permissions.",
            icon: Shield,
            color: '#ca8a04', // Changed from amber to gold
            duration: "3 minutes"
        },
        {
            title: "Go Live & Scale",
            description: "Start managing your HR processes efficiently and scale as you grow.",
            icon: CheckCircle,
            color: '#7c3aed', // Changed from violet
            duration: "Instant"
        }
    ];

    return (
        <section id="how-it-works" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 mb-4"> {/* Changed from blue-100 */}
                        <span className="text-sm font-medium" style={{ color: '#1a462b' }}> {/* Changed from blue */}
                            Get Started in Minutes
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Simple Setup, Instant Results
                    </h2>
                    <p className="text-lg text-gray-600">
                        Get your HR system up and running in under 15 minutes.
                    </p>
                </div>

                {/* Steps Desktop */}
                <div className="hidden md:block">
                    <div className="flex items-center justify-between mb-12">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <button
                                        onClick={() => setActiveStep(index)}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${activeStep >= index ? 'ring-4 ring-opacity-30' : ''
                                            }`}
                                        style={{
                                            backgroundColor: activeStep >= index ? step.color : '#f3f4f6',
                                            color: activeStep >= index ? 'white' : '#9ca3af',
                                            border: activeStep >= index ? 'none' : '2px solid #e5e7eb',
                                            outline: 'none'
                                        }}
                                    >
                                        <Icon className="w-8 h-8" />
                                    </button>
                                    <div className="text-center px-4">
                                        <h4 className={`font-semibold mb-2 ${activeStep === index ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {step.title}
                                        </h4>
                                        <p className="text-sm text-gray-500">{step.duration}</p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="flex-1 h-1 mx-8 mt-8">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: activeStep > index ? '100%' : '0%',
                                                    backgroundColor: step.color
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Step Content */}
                    <div className="bg-gradient-to-r from-green-50 to-gray-50 rounded-2xl p-8 md:p-12"> {/* Changed from blue-50 */}
                        <div className="max-w-2xl mx-auto">
                            <div className="flex items-start mb-6">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                                    style={{ backgroundColor: steps[activeStep].color + '20' }}
                                >
                                    {(() => {
                                        const Icon = steps[activeStep].icon;
                                        return <Icon className="w-6 h-6" style={{ color: steps[activeStep].color }} />;
                                    })()}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {steps[activeStep].title}
                                    </h3>
                                    <p className="text-gray-600 text-lg">
                                        {steps[activeStep].description}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {[
                                    "No technical knowledge required",
                                    "Guided setup wizard",
                                    "Import existing data",
                                    "24/7 support available"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center text-gray-700">
                                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" /> {/* Changed from green-500 */}
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps Mobile */}
                <div className="md:hidden space-y-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-start">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                                        style={{ backgroundColor: step.color + '20' }}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: step.color }} />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Step {index + 1}: {step.title}
                                            </h3>
                                            <span className="text-sm font-medium px-3 py-1 rounded-full bg-white">
                                                {step.duration}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <a
                        href="/onboarding"
                        className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-medium text-white transition-all hover:opacity-90 group"
                        style={{ backgroundColor: '#1a462b' }}
                    >
                        Start Your Free Trial
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <p className="text-gray-500 text-sm mt-4">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;