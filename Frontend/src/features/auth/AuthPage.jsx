import React from 'react';
import { LogIn } from 'lucide-react';

export default function AuthPage({ onLogin }) {
    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center justify-center font-sans tracking-tight">
            <div className="w-[380px] border border-slate-200 bg-white p-8 shadow-sm rounded-xl">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-[3px] shadow-sm" />
                        <h1 className="text-2xl font-bold font-mono tracking-tighter text-slate-900">InstaParse</h1>
                    </div>
                    <p className="text-slate-500 text-sm">Sign in to your account</p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">Email</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors rounded-lg placeholder:text-slate-400"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-500 font-mono uppercase tracking-wider font-semibold">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="bg-white border border-slate-200 text-slate-900 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors rounded-lg placeholder:text-slate-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 text-white font-semibold py-2.5 text-sm hover:focus:ring-2 hover:focus:ring-blue-500 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-lg shadow-sm"
                    >
                        <LogIn size={16} />
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
