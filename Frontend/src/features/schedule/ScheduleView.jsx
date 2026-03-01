import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function ScheduleView({ events }) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Create 35 calendar day cells (5 weeks)
    // Starting month on a Tuesday (offset 2) for aesthetic purposes
    const startOffset = 2;
    const daysInMonth = 30;

    const calendarDays = Array.from({ length: 35 }, (_, i) => {
        const dayNumber = i - startOffset + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
        const dayEvents = isCurrentMonth ? events.filter(e => e.date === dayNumber) : [];
        const isToday = dayNumber === 15; // mock today is 15th

        return {
            dayNumber,
            isCurrentMonth,
            isToday,
            events: dayEvents
        };
    });

    return (
        <div className="h-full w-full p-4 md:p-8 flex flex-col gap-4 md:gap-6 bg-slate-50 text-slate-900">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-4 shrink-0 gap-4 sm:gap-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Schedule</h2>
                    <p className="text-slate-500 text-sm font-mono mt-1">September 2026</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
                        <button className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="px-3 font-semibold text-sm">Today</span>
                        <button className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors border-l border-slate-200">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <button className="bg-blue-600 text-white font-semibold px-4 py-1.5 md:py-2 text-sm hover:focus:ring-2 hover:focus:ring-blue-500 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-lg shadow-sm shrink-0">
                        <Plus size={16} />
                        <span className="hidden sm:inline">New Event</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-[500px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
                    {daysOfWeek.map(day => (
                        <div key={day} className="py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.charAt(0)}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-200 gap-[1px]">
                    {calendarDays.map((day, i) => (
                        <div
                            key={i}
                            className={`p-1 md:p-2 flex flex-col overflow-hidden bg-white transition-colors hover:bg-slate-50 cursor-default ${!day.isCurrentMonth ? 'text-slate-400 bg-slate-50/50' : 'text-slate-900'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] md:text-sm font-semibold w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full ${day.isToday ? 'bg-blue-600 text-white shadow-sm' : ''}`}>
                                    {day.isCurrentMonth ? day.dayNumber : ''}
                                </span>
                            </div>

                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                                {day.events.map(event => (
                                    <div
                                        key={event.id}
                                        className="text-[9px] md:text-xs p-1 md:px-2 md:py-1 rounded bg-blue-50 border border-blue-100 text-blue-700 truncate font-medium flex items-center gap-1 cursor-pointer hover:bg-blue-100 hover:border-blue-200 transition-colors"
                                        title={`${event.time} - ${event.title}`}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 md:hidden" />
                                        <span className="opacity-70 font-mono hidden md:inline shrink-0">{event.time}</span>
                                        <span className="truncate">{event.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
