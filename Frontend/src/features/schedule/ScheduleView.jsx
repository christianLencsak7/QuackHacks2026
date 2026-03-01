import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, X, Trash2, MapPin, Tag, DollarSign, User, FileText, ChevronDown } from 'lucide-react';

const formatDate = (y, m, d) => {
    const yStr = y;
    const mStr = String(m + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    return `${yStr}-${mStr}-${dStr}`;
};

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function EventModal({ event, isNew, onClose, onDelete, onSave }) {
    const [formData, setFormData] = useState({ ...event });
    const [newTag, setNewTag] = useState('');
    const PRESET_TAGS = ['Concert', 'Date', 'Sports', 'Party', 'Meeting', 'Work', 'Class', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            if (!formData.typeTags.includes(newTag.trim())) {
                setFormData(prev => ({
                    ...prev,
                    typeTags: prev.typeTags ? [...prev.typeTags, newTag.trim()] : [newTag.trim()]
                }));
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({ ...prev, typeTags: prev.typeTags.filter(tag => tag !== tagToRemove) }));
    };

    const togglePresetTag = (tag) => {
        setFormData(prev => {
            const currentTags = prev.typeTags || [];
            if (currentTags.includes(tag)) return { ...prev, typeTags: currentTags.filter(t => t !== tag) };
            return { ...prev, typeTags: [...currentTags, tag] };
        });
    };

    // Clicking X or Outside triggers the auto-save if editing
    const handleCloseOutsideOrX = () => {
        if (!isNew) {
            onSave(formData);
        }
        onClose();
    };

    // Clicking 'Save Event' saves explicitly
    const handleSaveClick = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 overflow-y-auto" onClick={handleCloseOutsideOrX}>
            <div className="relative max-w-2xl w-full bg-slate-50 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="flex-shrink-0 border-b border-slate-200 bg-white p-4 md:px-6 flex items-center justify-between z-10 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                            {isNew ? 'New Event' : 'Event Details'}
                        </h2>
                        <p className="text-slate-500 text-xs mt-1">
                            {isNew ? 'Fill in details to add.' : 'Changes are saved automatically when you close this view.'}
                        </p>
                    </div>
                    <button onClick={handleCloseOutsideOrX} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
                        <X size={20} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Event Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-medium text-lg placeholder-slate-400" placeholder="e.g. QuackHacks 2026 Pitch" autoFocus={isNew} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><CalendarIcon size={14} className="text-slate-400" /> Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><CalendarIcon size={14} className="text-slate-400" /> End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Clock size={14} className="text-slate-400" /> Start Time</label>
                                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Clock size={14} className="text-slate-400" /> End Time</label>
                                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400" placeholder="Address, venue name, or link" />
                        </div>
                    </div>

                    {/* Extra Info */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Tag size={14} className="text-slate-400" /> Event Type / Tags</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {PRESET_TAGS.map(tag => (
                                    <button key={tag} onClick={() => togglePresetTag(tag)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.typeTags?.includes(tag) ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            {formData.typeTags?.filter(t => !PRESET_TAGS.includes(t)).length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3 pt-2 border-t border-slate-100">
                                    {formData.typeTags.filter(t => !PRESET_TAGS.includes(t)).map(tag => (
                                        <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-blue-900 focus:outline-none ml-1"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={handleAddTag} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400" placeholder="Type custom tag & press Enter" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><DollarSign size={14} className="text-slate-400" /> Cost</label>
                                <input type="text" name="cost" value={formData.cost} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400" placeholder="Free, $20, etc." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><User size={14} className="text-slate-400" /> Host / Organizer</label>
                                <input type="text" name="host" value={formData.host} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400" placeholder="Name or handle" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><FileText size={14} className="text-slate-400" /> Notes & Description</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none" placeholder="Add extra details..." />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row gap-3 justify-end items-center">
                        {!isNew && (
                            <button onClick={() => onDelete(formData.id)} className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors w-full md:w-auto justify-center md:mr-auto focus:outline-none">
                                <Trash2 size={16} /> Delete Event
                            </button>
                        )}
                        <button onClick={handleSaveClick} className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors w-full md:w-auto justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500">
                            Save Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ScheduleView() {
    const today = new Date();
    // Start currentDate cleanly avoiding time offset complexities
    const [currentDate, setCurrentDate] = useState(() => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        return d;
    });

    const [viewType, setViewType] = useState('Month');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const [events, setEvents] = useState([
        { id: 1, title: 'Q3 Planning Review', startTime: '14:00', endTime: '15:00', startDate: formatDate(today.getFullYear(), today.getMonth(), 15), endDate: formatDate(today.getFullYear(), today.getMonth(), 15), location: 'Conference Room A', typeTags: ['Meeting', 'Work'], cost: '', host: 'Alex', notes: 'Bring Q2 slides.', screenshotUrl: null },
        { id: 2, title: 'Dentist Appointment', startTime: '09:00', endTime: '10:00', startDate: formatDate(today.getFullYear(), today.getMonth(), 18), endDate: formatDate(today.getFullYear(), today.getMonth(), 18), location: 'Dr. Smith Clinic', typeTags: ['Personal'], cost: '$50', host: '', notes: 'Routine checkup.', screenshotUrl: null },
        { id: 3, title: 'Flight NY to SF', startTime: '18:45', endTime: '22:30', startDate: formatDate(today.getFullYear(), today.getMonth(), 25), endDate: formatDate(today.getFullYear(), today.getMonth(), 25), location: 'JFK Airport', typeTags: ['Travel'], cost: '$400', host: 'Delta', notes: 'Confirmation #AB1234', screenshotUrl: null },
        { id: 4, title: 'Team Sync', startTime: '10:00', endTime: '10:30', startDate: formatDate(today.getFullYear(), today.getMonth(), 15), endDate: formatDate(today.getFullYear(), today.getMonth(), 15), location: 'Zoom', typeTags: ['Meeting', 'Work'], cost: '', host: '', notes: '', screenshotUrl: null },
    ]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    export default function ScheduleView({ events = [], onUpdateEvent }) {
        const today = new Date();
        const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
        const [selectedEvent, setSelectedEvent] = useState(null);

        const handlePrev = () => {
            const d = new Date(currentDate);
            if (viewType === 'Month') {
                d.setDate(1);
                d.setMonth(d.getMonth() - 1);
            } else {
                d.setDate(d.getDate() - 7);
            }
            setCurrentDate(d);
        };

        const handleNext = () => {
            const d = new Date(currentDate);
            if (viewType === 'Month') {
                d.setDate(1);
                d.setMonth(d.getMonth() + 1);
            } else {
                d.setDate(d.getDate() + 7);
            }
            setCurrentDate(d);
        };

        const handleGoToday = () => {
            const d = new Date();
            d.setHours(12, 0, 0, 0);
            setCurrentDate(d);
        };

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Calendar Generation
        const calendarCells = [];
        let totalRowsForMonth = 0;

        if (viewType === 'Month') {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();
            const prevMonthDays = new Date(year, month, 0).getDate();
            totalRowsForMonth = Math.ceil((firstDay + daysInMonth) / 7);

            // Prev Month
            for (let i = firstDay - 1; i >= 0; i--) {
                const m = month - 1 < 0 ? 11 : month - 1;
                const y = month - 1 < 0 ? year - 1 : year;
                calendarCells.push({
                    dayNumber: prevMonthDays - i,
                    month: m,
                    year: y,
                    isCurrentMonth: false,
                    dateStr: formatDate(y, m, prevMonthDays - i),
                });
            }

            // Current Month
            for (let i = 1; i <= daysInMonth; i++) {
                calendarCells.push({
                    dayNumber: i,
                    month: month,
                    year: year,
                    isCurrentMonth: true,
                    dateStr: formatDate(year, month, i),
                });
            }

            // Next Month Padding (only pad to fill exactly the weeks needed)
            const totalCurrentCells = calendarCells.length;
            const totalCellsTarget = totalRowsForMonth * 7;
            for (let i = 1; i <= (totalCellsTarget - totalCurrentCells); i++) {
                const m = month + 1 > 11 ? 0 : month + 1;
                const y = month + 1 > 11 ? year + 1 : year;
                calendarCells.push({
                    dayNumber: i,
                    month: m,
                    year: y,
                    isCurrentMonth: false,
                    dateStr: formatDate(y, m, i),
                });
            }
        } else {
            totalRowsForMonth = 1;
            const currentDayOfWeek = currentDate.getDay();
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() - currentDayOfWeek);

            for (let i = 0; i < 7; i++) {
                const d = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
                calendarCells.push({
                    dayNumber: d.getDate(),
                    month: d.getMonth(),
                    year: d.getFullYear(),
                    isCurrentMonth: d.getMonth() === month,
                    dateStr: formatDate(d.getFullYear(), d.getMonth(), d.getDate())
                });
            }
        }

        const handleDeleteEvent = (id) => {
            setEvents(events.filter(e => e.id !== id));
            setSelectedEvent(null);
        };

        const handleSaveEvent = (updatedEvent) => {
            setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        };

        const goToPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
        const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));
        const goToToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

        const numRows = totalCells / 7;

        return (
            <div className="h-full w-full p-4 md:p-8 flex flex-col gap-4 md:gap-6 bg-slate-50 text-slate-900 relative">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-4 shrink-0 gap-4 sm:gap-0">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Schedule</h2>
                            <p className="text-slate-500 text-sm font-mono mt-1">{MONTHS[month]} {year}</p>
                        </div>
                        {/* View Switcher Dropdown */}
                        <div className="relative ml-2" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 border border-slate-200 bg-white px-3 py-1.5 md:py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-colors focus:outline-none"
                            >
                                {viewType} <ChevronDown size={14} className="text-slate-400" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 rounded-lg shadow-lg w-32 overflow-hidden z-20 transition-all origin-top scale-100 opacity-100">
                                    <button onClick={() => { setViewType('Month'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors focus:bg-slate-100 font-medium">Month</button>
                                    <button onClick={() => { setViewType('Week'); setDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors focus:bg-slate-100 font-medium border-t border-slate-100">Week</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
                            <button onClick={handlePrev} className="p-1.5 md:p-2 text-slate-400 border-r border-slate-200 hover:text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors focus:outline-none">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={handleGoToday} className="px-3 font-semibold text-sm hover:bg-slate-50 active:bg-slate-100 transition-colors h-full focus:outline-none">
                                Today
                            </button>
                            <button onClick={handleNext} className="p-1.5 md:p-2 text-slate-400 border-l border-slate-200 hover:text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors focus:outline-none">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <button onClick={() => setIsCreating(true)} className="bg-blue-600 text-white font-semibold px-4 py-1.5 md:py-2 text-sm hover:focus:ring-2 hover:focus:ring-blue-500 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-lg shadow-sm shrink-0">
                            <Plus size={16} />
                            <span className="hidden sm:inline">New Event</span>
                        </button>
                    </div >
                </header >

                <div className="flex-1 min-h-[500px] bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day} className="py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <span className="hidden sm:inline">{day}</span>
                                <span className="sm:hidden">{day.charAt(0)}</span>
                            </div>
                        ))}
                    </div>

                    <div
                        className="flex-1 grid grid-cols-7 bg-slate-200 gap-[1px]"
                        style={{ gridTemplateRows: viewType === 'Week' ? 'minmax(0, 1fr)' : `repeat(${totalRowsForMonth}, minmax(0, 1fr))` }}
                    >
                        {calendarCells.map((cell, i) => {
                            const dayEvents = events.filter(e => e.startDate === cell.dateStr);
                            dayEvents.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

                            // Ensure precise 'isToday' logic mapping the actual date
                            cell.isToday = cell.dateStr === formatDate(today.getFullYear(), today.getMonth(), today.getDate());

                            let displayLabel = cell.dayNumber;
                            if (cell.dayNumber === 1) {
                                displayLabel = `${SHORT_MONTHS[cell.month]} ${cell.dayNumber}`;
                            }

                            // Use appropriate dimensions for standard circular numbers vs pill labels like "Apr 1"
                            const labelHasMonth = String(displayLabel).length > 2;
                            const circleClasses = labelHasMonth ? 'px-2 py-0.5 rounded-full' : 'w-5 h-5 md:w-7 md:h-7 rounded-full';
                            const textClasses = cell.isToday ? 'bg-blue-600 text-white shadow-sm' : '';

                            return (
                                <div
                                    key={i}
                                    className={`p-1 md:p-2 flex flex-col overflow-hidden bg-white transition-colors hover:bg-slate-50 cursor-default ${!cell.isCurrentMonth && viewType === 'Month' ? 'text-slate-400 bg-slate-50/50' : 'text-slate-900'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] md:text-sm font-semibold flex items-center justify-center ${circleClasses} ${textClasses}`}>
                                            {displayLabel}
                                        </span>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                                        {dayEvents.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={() => setSelectedEvent(event)}
                                                className="text-[9px] md:text-xs p-1 md:px-2 md:py-1 rounded bg-blue-50 border border-blue-100 text-blue-700 truncate font-medium flex items-center gap-1 cursor-pointer hover:bg-blue-100 hover:border-blue-200 transition-colors"
                                                title={`${event.startTime} - ${event.title}`}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 md:hidden" />
                                                <span className="opacity-70 font-mono hidden md:inline shrink-0">{event.startTime}</span>
                                                <span className="truncate">{event.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {(selectedEvent || isCreating) && (
                    <EventModal
                        event={selectedEvent || {
                            id: '',
                            title: '',
                            startDate: formatDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                            endDate: formatDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                            startTime: '',
                            endTime: '',
                            location: '',
                            typeTags: [],
                            cost: '',
                            host: '',
                            notes: ''
                        }}
                        isNew={isCreating}
                        onClose={() => {
                            setSelectedEvent(null);
                            setIsCreating(false);
                        }}
                        onDelete={handleDeleteEvent}
                        onSave={(updatedEvent) => {
                            if (isCreating) {
                                const newEvent = { ...updatedEvent, id: Date.now() };
                                setEvents([...events, newEvent]);
                            } else {
                                handleSaveEvent(updatedEvent);
                            }
                        }}
                    />
                )
                }
            </div >
        );
    }
