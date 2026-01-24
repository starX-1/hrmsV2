'use client'
import { useState } from "react";
import { Check, X, Zap, Shield, Users } from 'lucide-react';

const Pricing = () => {
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    const plans = [
        {
            name: "Starter",
            description: "Perfect for small teams getting started",
            price: {
                monthly: 29,
                yearly: 299
            },
            features: [
                "Up to 10 employees",
                "Basic employee management",
                "Leave management",
                "Email support",
                "Basic reports",
                "2 GB storage"
            ],
            limitations: [
                "Advanced analytics",
                "Custom workflows",
                "API access",
                "Priority support"
            ],
            color: "#6b7280", // Keeping gray for starter tier
            icon: Users,
            popular: false
        },
        {
            name: "Professional",
            description: "Best for growing businesses",
            price: {
                monthly: 79,
                yearly: 790
            },
            features: [
                "Up to 50 employees",
                "Advanced employee management",
                "Roles & permissions",
                "Time & attendance",
                "Advanced analytics",
                "Email & chat support",
                "10 GB storage",
                "Custom workflows"
            ],
            limitations: [
                "Unlimited employees",
                "Dedicated account manager",
                "Custom integrations"
            ],
            color: "#1a462b", // Changed from blue to primary green
            icon: Shield,
            popular: true
        },
        {
            name: "Enterprise",
            description: "For large organizations with complex needs",
            price: {
                monthly: 199,
                yearly: 1990
            },
            features: [
                "Unlimited employees",
                "All Professional features",
                "Custom integrations",
                "Dedicated account manager",
                "24/7 phone support",
                "SLA guarantee",
                "Unlimited storage",
                "Advanced security",
                "Custom reporting",
                "Training sessions"
            ],
            limitations: [],
            color: "#15803d", // Changed from bright green to medium green
            icon: Zap,
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 mb-4"> {/* Changed from blue-100 */}
                        <span className="text-sm font-medium" style={{ color: '#1a462b' }}> {/* Changed from blue */}
                            Simple, Transparent Pricing
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h2>
                    <p className="text-lg text-gray-600">
                        Start free for 14 days. No credit card required. Cancel anytime.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${billingPeriod === 'monthly'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${billingPeriod === 'yearly'
                                ? 'bg-white shadow-sm text-gray-900'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Yearly <span className="text-green-600 ml-1">(Save 15%)</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        const isYearly = billingPeriod === 'yearly';
                        const price = isYearly ? plan.price.yearly : plan.price.monthly;
                        const perEmployee = plan.name === "Enterprise" ? "Custom" : `$${isYearly ? (price / 50 / 12).toFixed(2) : (price / 50).toFixed(2)}`;

                        return (
                            <div
                                key={index}
                                className={`relative rounded-2xl border-2 p-8 transition-all hover:shadow-xl ${plan.popular
                                    ? 'border-green-600 shadow-lg' // Changed from blue-500
                                    : 'border-gray-200 shadow-sm'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: plan.color }}>
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className="flex items-center mb-4">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                                            style={{ backgroundColor: plan.color + '20' }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: plan.color }} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                            <p className="text-sm text-gray-600">{plan.description}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-bold text-gray-900">${price}</span>
                                            <span className="text-gray-600 ml-2">
                                                {isYearly ? '/year' : '/month'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            ≈ {perEmployee} per employee/month
                                        </p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-3 mb-8">
                                    <p className="text-sm font-medium text-gray-900">Includes:</p>
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center">
                                            <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" /> {/* Changed from green-500 */}
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}

                                    {plan.limitations.length > 0 && (
                                        <>
                                            <p className="text-sm font-medium text-gray-900 mt-6">Not included:</p>
                                            {plan.limitations.map((limitation, idx) => (
                                                <div key={idx} className="flex items-center">
                                                    <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                                    <span className="text-sm text-gray-500">{limitation}</span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>

                                <button
                                    className={`w-full py-3 rounded-lg font-medium transition-all ${plan.popular
                                        ? 'text-white hover:opacity-90'
                                        : 'text-gray-700 border-2 hover:border-green-700 hover:text-green-700' // Changed from blue
                                        }`}
                                    style={plan.popular ? { backgroundColor: plan.color } : { borderColor: '#d1d5db' }}
                                    onClick={() => {
                                        // Handle plan selection
                                        console.log(`Selected ${plan.name} plan`);
                                    }}
                                >
                                    {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                                </button>

                                {plan.name === "Starter" && (
                                    <p className="text-center text-sm text-gray-500 mt-3">
                                        Free for teams up to 5
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* FAQ Section */}
                <div className="mt-16 pt-12 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {[
                            {
                                question: "Can I change plans later?",
                                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                            },
                            {
                                question: "Is there a long-term contract?",
                                answer: "No, all plans are month-to-month. You can cancel anytime without penalty."
                            },
                            {
                                question: "Do you offer discounts for non-profits?",
                                answer: "Yes, we offer special pricing for registered non-profit organizations. Contact our sales team."
                            },
                            {
                                question: "What payment methods do you accept?",
                                answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-6">
                                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                <p className="text-gray-600 text-sm">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;