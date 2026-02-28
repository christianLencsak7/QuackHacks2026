import React, { useState } from 'react';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';

export default function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateEmail = (email) => {
        // Basic regex for email validation
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        let hasError = false;

        if (!isLogin) {
            if (!formData.firstName.trim()) { newErrors.firstName = "First name is required."; hasError = true; }
            if (!formData.lastName.trim()) { newErrors.lastName = "Last name is required."; hasError = true; }
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
            hasError = true;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email.";
            hasError = true;
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required.";
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            onLogin();
        }
    };

    // Switch between Sign in and Sign up modes
    const switchMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
    };

    const baseInputClass = "w-full bg-white border px-3 py-2 text-sm focus:outline-none transition-colors rounded-lg";
    const normalInputClass = "border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
    const errorInputClass = "border-red-500 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500";

    const getInputClass = (fieldName) => {
        return `${baseInputClass} ${errors[fieldName] ? errorInputClass : normalInputClass}`;
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center justify-center font-sans tracking-tight">
            <div className="w-[380px] border border-slate-200 bg-white p-8 shadow-sm rounded-xl">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-[3px] shadow-sm" />
                        <h1 className="text-2xl font-bold font-mono tracking-tighter text-slate-900">InstaParse</h1>
                    </div>
                    <p className="text-slate-500 text-sm">
                        {isLogin ? "Sign in to your account" : "Create a new account"}
                    </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    {!isLogin && (
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={getInputClass('firstName')}
                                />
                                {errors.firstName && (
                                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mt-0.5">
                                        <AlertCircle size={14} />
                                        <span>{errors.firstName}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={getInputClass('lastName')}
                                />
                                {errors.lastName && (
                                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mt-0.5">
                                        <AlertCircle size={14} />
                                        <span>{errors.lastName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={getInputClass('email')}
                        />
                        {errors.email && (
                            <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mt-0.5">
                                <AlertCircle size={14} />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={getInputClass('password')}
                        />
                        {errors.password && (
                            <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mt-0.5">
                                <AlertCircle size={14} />
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 text-white font-semibold py-2.5 text-sm hover:focus:ring-2 hover:focus:ring-blue-500 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-lg shadow-sm"
                    >
                        {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>

                    <div className="mt-2 text-center text-sm text-slate-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            type="button"
                            onClick={switchMode}
                            className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-none"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
