import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';

export default function EventListView({ events }) {
    // Sort events by date ascending
    const sortedEvents = [...events].sort((a, b) => a.date - b.date);

    return (
        <div className="h-full w-full p-4 md:p-8 flex flex-col gap-4 md:gap-6 bg-slate-50 text-slate-900 overflow-hidden">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-4 shrink-0 gap-4 sm:gap-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Events List</h2>
                    <p className="text-slate-500 text-sm font-mono mt-1">September 2026</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20 md:pb-0">
                {sortedEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                        <CalendarIcon size={48} strokeWidth={1} />
                        <p>No events scheduled.</p>
                    </div>
                ) : (
                    sortedEvents.map(event => (
                        <div key={event.id} className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 hover:border-slate-300 hover:shadow-md transition-all">
                            {/* Left column: Date prominently displayed */}
                            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-6 shrink-0 w-full md:w-32">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:block">SEP</span>
                                <div className="flex md:flex-col items-baseline gap-1 md:gap-0">
                                    <span className="text-sm font-semibold text-slate-500 uppercase md:hidden mr-1">SEP</span>
                                    <span className="text-2xl md:text-4xl font-bold text-slate-900 leading-none">{event.date}</span>
                                </div>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md md:mt-2">{event.time}</span>
                            </div>

                            {/* Right column: Event Details */}
                            <div className="flex-1 flex flex-col justify-center gap-2">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{event.title}</h3>
                                    {event.type && (
                                        <span className="shrink-0 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                            {event.type}
                                        </span>
                                    )}
                                </div>

                                {/* Render extra details from fullData if available (from the human verification step) */}
                                {(event.fullData?.location || event.fullData?.host) && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 mt-1">
                                        {event.fullData.location && (
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <MapPin size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{event.fullData.location}</span>
                                            </div>
                                        )}
                                        {event.fullData.host && (
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <Tag size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate">Host: {event.fullData.host}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
