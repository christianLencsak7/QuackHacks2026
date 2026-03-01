import React from 'react';
import { Camera, Calendar, Settings, LogOut, List } from 'lucide-react';

export default function Sidebar({ currentView, onViewChange, onLogout }) {
    const navItems = [
        { id: 'capture', label: 'Capture', icon: Camera },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'list', label: 'Events List', icon: List },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 w-full md:relative md:w-20 md:h-screen border-t md:border-t-0 md:border-r border-slate-200 bg-white flex flex-row md:flex-col items-center justify-between md:py-6 px-4 md:px-0 flex-shrink-0 z-50 md:z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-sm">
            {/* Logo area - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-col items-center gap-8 w-full">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex-shrink-0 shadow-sm" />
            </div>

            {/* Navigation Options - Centered on desktop, full width flex-row on mobile */}
            <nav className="flex flex-row md:flex-col gap-2 md:gap-4 w-full md:px-2 flex-1 md:flex-none justify-around md:justify-start">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`flex-1 md:w-full md:aspect-square flex flex-col items-center justify-center py-2 md:py-0 gap-1 transition-all rounded-xl ${isActive ? 'text-blue-600 md:bg-blue-50 md:shadow-sm' : 'text-slate-400 hover:text-slate-700 md:hover:bg-slate-50'
                                }`}
                            title={item.label}
                        >
                            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-blue-600' : ''} />
                            <span className={`text-[10px] font-mono tracking-tighter uppercase mt-1 font-semibold ${isActive ? 'text-blue-600' : 'hidden md:block'}`}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions - Right aligned on mobile, bottom aligned on desktop */}
            <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-auto md:w-full md:px-2 md:mt-auto border-l md:border-l-0 pl-4 md:pl-0 border-slate-100">
                <button className="p-2 md:w-full md:aspect-square flex flex-col items-center justify-center text-slate-400 hover:text-slate-700 md:hover:bg-slate-50 rounded-xl transition-all">
                    <Settings size={20} className="md:mb-1" strokeWidth={1.5} />
                    <span className="text-[10px] font-mono tracking-tighter uppercase hidden md:block">Settings</span>
                </button>
                <button
                    onClick={onLogout}
                    className="p-2 md:w-full md:aspect-square flex flex-col items-center justify-center text-slate-400 hover:text-red-600 md:hover:bg-red-50 rounded-xl transition-all"
                >
                    <LogOut size={20} className="md:mb-1" strokeWidth={1.5} />
                    <span className="text-[10px] font-mono tracking-tighter uppercase hidden md:block">Log Out</span>
                </button>
            </div>
        </div >
    );
}
