import { Users, Shield, Settings, BarChart3, FileText, Clock, Bell, Zap } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: Users,
            title: "Employee Management",
            description: "Centralize all employee data, documents, and information in one secure platform.",
            color: '#1a462b' // Changed from blue
        },
        {
            icon: Shield,
            title: "Roles & Permissions",
            description: "Granular control over user access with customizable permission levels.",
            color: '#15803d' // Changed from bright green to darker green
        },
        {
            icon: FileText,
            title: "Leave Management",
            description: "Automated leave requests, approvals, and balance tracking.",
            color: '#ca8a04' // Changed from amber to gold
        },
        {
            icon: BarChart3,
            title: "Analytics Dashboard",
            description: "Real-time insights into HR metrics and workforce analytics.",
            color: '#7c3aed' // Changed from violet to a more harmonious purple
        },
        {
            icon: Settings,
            title: "Custom Workflows",
            description: "Design automated HR workflows tailored to your company needs.",
            color: '#dc2626' // Changed from red to darker red
        },
        {
            icon: Clock,
            title: "Time & Attendance",
            description: "Track employee hours, overtime, and attendance patterns.",
            color: '#0d9488' // Changed from cyan to teal
        },
        {
            icon: Bell,
            title: "Smart Notifications",
            description: "Automated reminders for important HR deadlines and events.",
            color: '#ea580c' // Changed from orange to darker orange
        },
        {
            icon: Zap,
            title: "Fast Onboarding",
            description: "Get new employees up and running in minutes, not days.",
            color: '#059669' // Changed from emerald to darker green
        }
    ];

    return (
        <section id="features" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 mb-4">
                        <span className="text-sm font-medium" style={{ color: '#1a462b' }}>
                            Features
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Everything You Need in One Platform
                    </h2>
                    <p className="text-lg text-gray-600">
                        Comprehensive HR tools designed to simplify complex processes and boost productivity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group cursor-pointer"
                            >
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: feature.color + '20' }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Feature Highlight */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2 p-8 md:p-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Advanced Security & Compliance
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Enterprise-grade security with GDPR, HIPAA, and SOC2 compliance built-in.
                                Your data is protected with bank-level encryption and regular security audits.
                            </p>
                            <ul className="space-y-3">
                                {['End-to-end encryption', 'Two-factor authentication', 'Regular security audits', 'GDPR compliant', 'Role-based access control'].map((item, index) => (
                                    <li key={index} className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:w-1/2 bg-gradient-to-br from-green-700 to-green-900 p-8 md:p-12 flex items-center justify-center">
                            <div className="text-white text-center">
                                <Shield className="w-16 h-16 mx-auto mb-4" />
                                <h4 className="text-xl font-bold mb-2">Security First</h4>
                                <p className="text-green-200">Your data is our top priority</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;