'use client'
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, Check, Eye, EyeOff } from 'lucide-react';
import { showToast } from '@/app/utils/toast';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            console.log('Sign in result:', result);
            if (result?.error) {
                setError('Invalid email or password');
            } else if (result?.ok) {
                // Sign in successful
                toast.success('Sign in successful!');
                router.push('/dashboard');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Sign in error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#f6f7f9' }}>
            {/* Left Panel - Brand/Info Section */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ backgroundColor: '#1a462b' }}>
                <div className="max-w-md text-white">
                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#15803d' }}>
                            <Users className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Welcome to HRMS Pro</h1>
                        <p className="text-green-100 text-lg">
                            Streamline your human resource management with our comprehensive platform.
                            Manage employees, track attendance, and optimize your workforce.
                        </p>
                    </div>
                    <div className="space-y-4 mt-12">
                        <div className="flex items-start">
                            <Check className="w-6 h-6 mr-3 mt-1 flex-shrink-0" style={{ color: '#15803d' }} />
                            <p>Employee management & onboarding</p>
                        </div>
                        <div className="flex items-start">
                            <Check className="w-6 h-6 mr-3 mt-1 flex-shrink-0" style={{ color: '#15803d' }} />
                            <p>Advanced role-based permissions</p>
                        </div>
                        <div className="flex items-start">
                            <Check className="w-6 h-6 mr-3 mt-1 flex-shrink-0" style={{ color: '#15803d' }} />
                            <p>Real-time analytics & reporting</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold mb-2" style={{ color: '#1a462b' }}>Sign In</h2>
                        <p className="text-gray-600 mb-8">Access your HRMS dashboard</p>

                        <form onSubmit={handleSignIn} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={isLoading}
                                        className="w-4 h-4 rounded disabled:cursor-not-allowed"
                                        style={{ accentColor: '#1a462b' }}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm font-medium hover:underline"
                                    style={{ color: '#1a462b' }}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 text-white font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#1a462b' }}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;