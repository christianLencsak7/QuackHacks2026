import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ message = "Loading..." }) {
    return (
        <div className="fixed inset-0 bg-slate-50/90 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4 text-center border border-slate-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Image</h3>
                <p className="text-slate-500 text-sm">
                    {message}
                </p>
            </div>
        </div>
    );
}
