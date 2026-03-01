import React, { useState } from 'react';
import { LogIn, UserPlus, Info } from 'lucide-react';

export default function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error text dynamically whenever the user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: undefined });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email.';
        }

        if (!formData.password) newErrors.password = 'Password is required.';

        if (!isLogin) {
            if (!formData.firstName) newErrors.firstName = 'First name is required.';
            if (!formData.lastName) newErrors.lastName = 'Last name is required.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    // Can pass firstName/lastName here later if we add them to profiles table
                })
            });
            const data = await res.json();

            if (!res.ok) {
                setErrors({ auth: data.error || 'Authentication failed' });
                return;
            }

            onLogin(data.user);
        } catch (err) {
            setErrors({ auth: 'Network error. Please try again.' });
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center justify-center font-sans tracking-tight">
            <div className="w-[380px] border border-slate-200 bg-white p-8 shadow-sm rounded-xl transition-all duration-300">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-[3px] shadow-sm" />
                        <h1 className="text-2xl font-bold font-mono tracking-tighter text-slate-900">Rally</h1>
                    </div>
                    <p className="text-slate-500 text-sm">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                    {errors.auth && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <Info size={16} />
                            {errors.auth}
                        </div>
                    )}
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                    {!isLogin && (
                        <div className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full bg-white border text-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors rounded-lg placeholder:text-slate-400 ${errors.firstName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                                        }`}
                                />
                                {errors.firstName && (
                                    <div className="flex items-center gap-1.5 text-red-500 text-xs mt-0.5 animate-in fade-in">
                                        <Info size={14} className="flex-shrink-0" />
                                        <span>{errors.firstName}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full bg-white border text-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors rounded-lg placeholder:text-slate-400 ${errors.lastName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                                        }`}
                                />
                                {errors.lastName && (
                                    <div className="flex items-center gap-1.5 text-red-500 text-xs mt-0.5 animate-in fade-in">
                                        <Info size={14} className="flex-shrink-0" />
                                        <span>{errors.lastName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-white border text-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors rounded-lg placeholder:text-slate-400 ${errors.email
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                        />
                        {errors.email && (
                            <div className="flex items-center gap-1.5 text-red-500 text-xs mt-0.5 animate-in fade-in">
                                <Info size={14} className="flex-shrink-0" />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full bg-white border text-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-1 transition-colors rounded-lg placeholder:text-slate-400 ${errors.password
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                                }`}
                        />
                        {errors.password && (
                            <div className="flex items-center gap-1.5 text-red-500 text-xs mt-0.5 animate-in fade-in">
                                <Info size={14} className="flex-shrink-0" />
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 text-white font-semibold py-2.5 text-sm hover:focus:ring-2 hover:focus:ring-blue-500 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-lg shadow-sm"
                    >
                        {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="w-full h-[1px] bg-slate-100" />
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setFormData({ firstName: '', lastName: '', email: '', password: '' });
                            setErrors({});
                        }}
                        className="text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium focus:outline-none"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
