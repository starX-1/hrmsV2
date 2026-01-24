// app/components/onboarding.tsx
'use client'

import { useState } from "react";
import { UserPlus, X, Loader2, CheckCircle } from 'lucide-react';
import { createCompany } from "@/app/api/company";
import { creaeteCompanyAdmin } from "@/app/api/admin";
import { assignAdminRole } from "@/app/api/roles";
import { toast } from "react-toastify";

interface OnboardingPageProps {
    onCancel: () => void;
}

const OnboardingPage = ({ onCancel }: OnboardingPageProps) => {
    const [onboardingStep, setOnboardingStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stepLoading, setStepLoading] = useState(false);
    const [submissionStep, setSubmissionStep] = useState<'company' | 'admin' | 'role' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state - only required fields
    const [formData, setFormData] = useState({
        // Company data
        companyName: '',
        companyEmail: '',
        companyAddress: '',
        companyPhone: '',
        // Admin data
        firstname: '',
        lastname: '',
        adminEmail: '',
        adminPhone: '',
        gender: ''
    });

    interface FormData {
        companyName: string;
        companyEmail: string;
        companyAddress: string;
        companyPhone: string;
        firstname: string;
        gender: string;
        lastname: string;
        adminEmail: string;
        adminPhone: string;
    }

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCancel = () => {
        if (loading || isSubmitting) return; // Prevent cancel during loading

        if (onboardingStep > 1) {
            // Ask for confirmation if user has entered data
            if (formData.companyName || formData.companyEmail) {
                if (!confirm('Are you sure you want to cancel? All entered data will be lost.')) {
                    return;
                }
            }
        }
        onCancel();
    };

    const validateCurrentStep = (): boolean => {
        switch (onboardingStep) {
            case 1:
                return !!(formData.companyName && formData.companyEmail && formData.companyAddress && formData.companyPhone);
            case 2:
                return !!(formData.firstname && formData.lastname && formData.adminEmail && formData.adminPhone && formData.gender);
            case 3:
                return true; // Review step doesn't need validation
            default:
                return false;
        }
    };

    const handleNext = async () => {
        if (loading || stepLoading || isSubmitting) return;

        // Validate current step before proceeding
        if (onboardingStep < 3 && !validateCurrentStep()) {
            toast.error('Please fill in all required fields before proceeding.');
            return;
        }

        if (onboardingStep < 3) {
            // Simulate a brief loading state for step transitions
            setStepLoading(true);
            setTimeout(() => {
                setOnboardingStep(onboardingStep + 1);
                setStepLoading(false);
            }, 300);
        } else {
            await handleSubmit();
        }
    };

    const handlePrevious = () => {
        if (loading || stepLoading || isSubmitting) return;

        if (onboardingStep > 1) {
            setOnboardingStep(onboardingStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setLoading(true);

        try {
            // Prepare company data
            const companyBody = {
                name: formData.companyName,
                email: formData.companyEmail,
                address: formData.companyAddress,
                phone: formData.companyPhone
            };

            // Prepare admin data
            const adminBody = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.adminEmail,
                phone: formData.adminPhone,
                gender: formData.gender
            };

            // Step 1: Create company
            setSubmissionStep('company');
            const company = await createCompany(companyBody);

            if (company?.data?.message !== "Company created successfully") {
                throw new Error(`Failed to create company: ${company?.data?.message || 'Unknown error'}`);
            }

            // Step 2: Create admin with company ID
            setSubmissionStep('admin');
            const adminBodyWithCompanyId = {
                ...adminBody,
                companyId: company?.data?.company?.id
            };

            const admin = await creaeteCompanyAdmin(adminBodyWithCompanyId);

            if (admin.message !== "Employee added successfully. Credentials sent to email.") {
                throw new Error(`Failed to create admin: ${admin.message || 'Unknown error'}`);
            }

            // Step 3: Assign admin role
            setSubmissionStep('role');
            const role = await assignAdminRole({ userId: admin.employee.userId });

            if (role.message !== "Role assigned to user successfully") {
                throw new Error(`Failed to assign role: ${role.message || 'Unknown error'}`);
            }

            // Success - show toast and close
            toast.success(
                <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Company onboarded successfully!
                </div>
            );
            onCancel();

        } catch (error: any) {
            console.error('Onboarding error:', error);

            // Show appropriate error message
            const errorMessage = error.message || 'Failed to complete onboarding. Please try again.';
            toast.error(
                <div>
                    <p className="font-medium">Onboarding Failed</p>
                    <p className="text-sm">{errorMessage}</p>
                </div>
            );

        } finally {
            setLoading(false);
            setIsSubmitting(false);
            setSubmissionStep(null);
        }
    };

    const steps = [
        { number: 1, title: "Company Info" },
        { number: 2, title: "Admin Account" },
        { number: 3, title: "Review" }
    ];

    const renderStepContent = () => {
        switch (onboardingStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Company Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => handleInputChange('companyName', e.target.value)}
                                placeholder="Acme12 Corporation"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Email *</label>
                            <input
                                type="email"
                                value={formData.companyEmail}
                                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                                placeholder="contact12@acme.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Address *</label>
                            <input
                                type="text"
                                value={formData.companyAddress}
                                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                                placeholder="123 Main Street, Nairobi, Kenya"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone *</label>
                            <input
                                type="tel"
                                value={formData.companyPhone}
                                onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                                placeholder="+254712345678"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Admin Account</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                            <input
                                type="text"
                                value={formData.firstname}
                                onChange={(e) => handleInputChange('firstname', e.target.value)}
                                placeholder="John"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                            <input
                                type="text"
                                value={formData.lastname}
                                onChange={(e) => handleInputChange('lastname', e.target.value)}
                                placeholder="Doe"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                            <input
                                type="email"
                                value={formData.adminEmail}
                                onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                                placeholder="john.doe@example.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                            <input
                                type="tel"
                                value={formData.adminPhone}
                                onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                                placeholder="+254712345678"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={loading || isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed"
                                        disabled={loading || isSubmitting}
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700">Male</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed"
                                        disabled={loading || isSubmitting}
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700">Female</label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-semibold text-gray-800">Review Details</h2>

                        {isSubmitting ? (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Setting up your organization...</h3>

                                    <div className="space-y-3">
                                        <div className={`flex items-center ${submissionStep === 'company' ? 'text-blue-600' : submissionStep === 'admin' || submissionStep === 'role' ? 'text-green-600' : 'text-gray-400'}`}>
                                            <div className="mr-3">
                                                {submissionStep === 'company' ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (submissionStep === 'admin' || submissionStep === 'role') ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                                )}
                                            </div>
                                            <span>Creating company profile</span>
                                        </div>

                                        <div className={`flex items-center ${submissionStep === 'admin' ? 'text-blue-600' : submissionStep === 'role' ? 'text-green-600' : 'text-gray-400'}`}>
                                            <div className="mr-3">
                                                {submissionStep === 'admin' ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : submissionStep === 'role' ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                                )}
                                            </div>
                                            <span>Creating admin account</span>
                                        </div>

                                        <div className={`flex items-center ${submissionStep === 'role' ? 'text-blue-600' : 'text-gray-400'}`}>
                                            <div className="mr-3">
                                                {submissionStep === 'role' ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                                )}
                                            </div>
                                            <span>Assigning admin role</span>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-blue-700">
                                        Please wait while we set up your organization. This may take a few moments...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Company Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Company Name</p>
                                            <p className="font-medium text-gray-900">{formData.companyName || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Company Email</p>
                                            <p className="font-medium text-gray-900">{formData.companyEmail || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Company Address</p>
                                            <p className="font-medium text-gray-900">{formData.companyAddress || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Company Phone</p>
                                            <p className="font-medium text-gray-900">{formData.companyPhone || "Not provided"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Admin Account</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Full Name</p>
                                            <p className="font-medium text-gray-900">
                                                {formData.firstname || formData.lastname ? `${formData.firstname} ${formData.lastname}`.trim() : "Not provided"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Email</p>
                                            <p className="font-medium text-gray-900">{formData.adminEmail || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Phone</p>
                                            <p className="font-medium text-gray-900">{formData.adminPhone || "Not provided"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Gender</p>
                                            <p className="font-medium text-gray-900">{formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : "Not provided"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                    By submitting, you agree to our Terms of Service and Privacy Policy. Your company admin account will be created with the information provided.
                                </div>
                            </>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const getStepCompletionIcon = (stepNumber: number) => {
        if (onboardingStep > stepNumber) {
            return <CheckCircle className="w-5 h-5" />;
        }
        return stepNumber;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 relative">
                    {/* Cancel Button */}
                    <button
                        onClick={handleCancel}
                        disabled={loading || isSubmitting}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        title="Cancel"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <UserPlus className="w-6 h-6 text-green-600" />
                            <h1 className="text-3xl font-bold text-gray-800">Company Admin Onboarding</h1>
                        </div>
                        <p className="text-gray-600">Let&#39;s set up your organization</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${onboardingStep >= step.number ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
                                        } ${stepLoading || loading || isSubmitting ? 'opacity-75' : ''}`}
                                >
                                    {getStepCompletionIcon(step.number)}
                                </div>
                                <p className={`ml-2 text-sm font-medium ${onboardingStep >= step.number ? 'text-gray-800' : 'text-gray-500'
                                    } ${stepLoading || loading || isSubmitting ? 'opacity-75' : ''}`}>
                                    {step.title}
                                </p>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-4 ${onboardingStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                                        } ${stepLoading || loading || isSubmitting ? 'opacity-50' : ''}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="mb-8">
                        {renderStepContent()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-between">
                        <div className="flex gap-3">
                            {onboardingStep > 1 && !isSubmitting && (
                                <button
                                    onClick={handlePrevious}
                                    disabled={loading || stepLoading || isSubmitting}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                >
                                    Previous
                                </button>
                            )}
                            <button
                                onClick={handleCancel}
                                disabled={loading || isSubmitting}
                                className="px-6 py-3 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                                Cancel
                            </button>
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={loading || stepLoading || isSubmitting}
                            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 flex items-center justify-center min-w-[160px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : stepLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : onboardingStep === 3 ? (
                                'Submit & Complete Setup'
                            ) : (
                                'Next'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;