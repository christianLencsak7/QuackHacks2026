import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import EventDetailModal from '../../components/EventDetailModal';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ScheduleView({ events = [], onUpdateEvent }) {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [createDate, setCreateDate] = useState(null);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); // 0-indexed

    const monthLabel = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // First day of month (0=Sun ... 6=Sat) and total days
    const startOffset = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Build calendar grid (enough rows to show the full month)
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    const calendarDays = Array.from({ length: totalCells }, (_, i) => {
        const dayNumber = i - startOffset + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
        const isToday =
            isCurrentMonth &&
            dayNumber === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        // Match events that fall on this day (events store day-of-month as `date`)
        const dayEvents = isCurrentMonth ? events.filter(e => e.date === dayNumber) : [];

        return { dayNumber, isCurrentMonth, isToday, events: dayEvents };
    });

    const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));
    const goToToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

    const numRows = totalCells / 7;

    return (
        <div className="h-full w-full p-4 md:p-8 flex flex-col gap-4 md:gap-6 bg-slate-50 text-slate-900">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-4 shrink-0 gap-4 sm:gap-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Schedule</h2>
                    <p className="text-slate-500 text-sm font-mono mt-1">{monthLabel}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
                        <button
                            onClick={goToPrevMonth}
                            className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={goToToday}
                            className="px-3 font-semibold text-sm hover:bg-slate-50 transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={goToNextMonth}
                            className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors border-l border-slate-200"
                            aria-label="Next month"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <button onClick={() => { setCreateDate(today); setIsCreating(true); }} className="bg-blue-600 text-white font-semibold px-4 py-1.5 md:py-2 text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-lg shadow-sm shrink-0">
                        <Plus size={16} />
                        <span className="hidden sm:inline">New Event</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-[500px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                {/* Day-of-week header */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.charAt(0)}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className={`flex-1 grid grid-cols-7 grid-rows-${numRows} bg-slate-200 gap-[1px]`}>
                    {calendarDays.map((day, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                if (day.isCurrentMonth) {
                                    setCreateDate(new Date(year, month, day.dayNumber));
                                    setIsCreating(true);
                                }
                            }}
                            className={`p-1 md:p-2 flex flex-col overflow-hidden bg-white transition-colors hover:bg-slate-50 ${day.isCurrentMonth ? 'cursor-pointer pointer-events-auto' : 'cursor-default pointer-events-none text-slate-300 bg-slate-50/50'} text-slate-900`}
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
                                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
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

            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onSave={(updated) => {
                        if (onUpdateEvent) onUpdateEvent(updated);
                        setSelectedEvent(null);
                    }}
                />
            )}

            {isCreating && (
                <EventDetailModal
                    event={{
                        isNew: true,
                        title: 'New Event',
                        date: createDate ? createDate.getDate() : today.getDate(),
                        start_date: createDate ? createDate.toISOString().split('T')[0] : today.toISOString().split('T')[0],
                        start_time: '12:00',
                        end_time: '13:00',
                        location: '',
                        event_type: 'Meeting'
                    }}
                    onClose={() => {
                        setIsCreating(false);
                        setCreateDate(null);
                    }}
                    onSave={(created) => {
                        if (onUpdateEvent) onUpdateEvent(created);
                        setIsCreating(false);
                        setCreateDate(null);
                    }}
                />
            )}
        </div>
    );
}
