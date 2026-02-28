import React from 'react';
import { Camera, Calendar, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ currentView, onViewChange, onLogout }) {
    const navItems = [
        { id: 'capture', label: 'Capture', icon: Camera },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
    ];

    return (
        <div className="w-16 md:w-20 h-screen border-r border-slate-200 bg-white flex flex-col items-center py-6 justify-between flex-shrink-0 z-10 shadow-sm">
            <div className="flex flex-col items-center gap-8 w-full">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex-shrink-0 shadow-sm" />

                <nav className="flex flex-col gap-4 w-full px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                className={`w-full aspect-square flex flex-col items-center justify-center gap-1 transition-all rounded-xl ${isActive ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                                title={item.label}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                                <span className="text-[10px] font-mono tracking-tighter uppercase hidden md:block mt-1 font-semibold">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="flex flex-col gap-4 w-full px-2">
                <button className="w-full aspect-square flex flex-col items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
                    <Settings size={20} className="md:mb-1" strokeWidth={1.5} />
                    <span className="text-[10px] font-mono tracking-tighter uppercase hidden md:block">Settings</span>
                </button>
                <button
                    onClick={onLogout}
                    className="w-full aspect-square flex flex-col items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                    <LogOut size={20} className="md:mb-1" strokeWidth={1.5} />
                    <span className="text-[10px] font-mono tracking-tighter uppercase hidden md:block">Log Out</span>
                </button>
            </div>
        </div>
    );
}
