import React, { useState } from 'react';
import { Calendar, MapPin, Tag, DollarSign, User, FileText, Check, X, Image as ImageIcon } from 'lucide-react';

export default function EventVerificationView({ initialData, onApprove, onCancel }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        startDate: initialData?.startDate || '',
        endDate: initialData?.endDate || '',
        startTime: initialData?.startTime || '',
        endTime: initialData?.endTime || '',
        location: initialData?.location || '',
        typeTags: initialData?.typeTags || [],
        cost: initialData?.cost || '',
        host: initialData?.host || '',
        notes: initialData?.notes || '',
        screenshotUrl: initialData?.screenshotUrl || null
    });

    const [newTag, setNewTag] = useState('');
    const [isScreenshotExpanded, setIsScreenshotExpanded] = useState(false);

    const PRESET_TAGS = ['Concert', 'Date', 'Sports', 'Party', 'Meeting', 'Work', 'Class', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            if (!formData.typeTags.includes(newTag.trim())) {
                setFormData(prev => ({ ...prev, typeTags: [...prev.typeTags, newTag.trim()] }));
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            typeTags: prev.typeTags.filter(tag => tag !== tagToRemove)
        }));
    };

    const togglePresetTag = (tag) => {
        setFormData(prev => {
            if (prev.typeTags.includes(tag)) {
                return { ...prev, typeTags: prev.typeTags.filter(t => t !== tag) };
            } else {
                return { ...prev, typeTags: [...prev.typeTags, tag] };
            }
        });
    };

    return (
        <div className="h-full w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden relative pb-16 md:pb-0">
            <header className="flex-shrink-0 border-b border-slate-200 bg-white p-6 md:px-8 flex items-center justify-between z-10 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Verify Event Details</h2>
                    <p className="text-slate-500 text-sm mt-1">Please review the extracted information before adding to schedule.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
                    >
                        <X size={16} /> Cancel
                    </button>
                    <button
                        onClick={() => onApprove(formData)}
                        className="px-4 py-2 flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium text-sm shadow-sm"
                    >
                        <Check size={16} /> Approve
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-medium text-lg placeholder-slate-400"
                                    placeholder="e.g. QuackHacks 2026 Pitch"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Dates */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" /> End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-500"
                                    />
                                </div>

                                {/* Times */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-500"
                                        placeholder="Default 2 hrs"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-400" /> Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                                    placeholder="Address, venue name, or link"
                                />
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <Tag size={14} className="text-slate-400" /> Event Type / Tags
                                </label>

                                {/* Preset Tag Selection */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {PRESET_TAGS.map(tag => {
                                        const isSelected = formData.typeTags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => togglePresetTag(tag)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Tags Display */}
                                {formData.typeTags.filter(t => !PRESET_TAGS.includes(t)).length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3 pt-3 border-t border-slate-100">
                                        {formData.typeTags.filter(t => !PRESET_TAGS.includes(t)).map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100">
                                                {tag}
                                                <button onClick={() => removeTag(tag)} className="hover:text-blue-900 focus:outline-none ml-1">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 mt-1"
                                    placeholder="Type a custom tag and press Enter"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Cost */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                        <DollarSign size={14} className="text-slate-400" /> Cost
                                    </label>
                                    <input
                                        type="text"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                                        placeholder="Free, $20, etc."
                                    />
                                </div>
                                {/* Host */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                        <User size={14} className="text-slate-400" /> Host / Organizer
                                    </label>
                                    <input
                                        type="text"
                                        name="host"
                                        value={formData.host}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                                        placeholder="Name or handle"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                    <FileText size={14} className="text-slate-400" /> Notes & Description
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
                                    placeholder="Add any extra details, links, or context here..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Screenshot Area */}
                    <div className="lg:col-span-1 border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-200 lg:border-none">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
                            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <ImageIcon size={16} className="text-blue-500" /> Original Source
                            </h3>

                            {formData.screenshotUrl ? (
                                <div
                                    className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer group"
                                    onClick={() => setIsScreenshotExpanded(true)}
                                >
                                    <div className="relative flex justify-center bg-slate-800">
                                        <img
                                            src={formData.screenshotUrl}
                                            alt="Original screenshot"
                                            className="w-full max-h-80 object-contain"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex flex-col items-center justify-center">
                                            <div className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                Click to expand
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-[9/16] bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                                    <ImageIcon size={32} className="mb-3 text-slate-300" strokeWidth={1} />
                                    <p className="text-sm font-medium">No Image Available</p>
                                    <p className="text-xs mt-1 px-4">The source image was not provided during extraction.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Screenshot Modal */}
            {isScreenshotExpanded && formData.screenshotUrl && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                    onClick={() => setIsScreenshotExpanded(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center rounded-xl overflow-hidden shadow-2xl">
                        <div className="w-full flex justify-end bg-slate-900 p-2">
                            <button
                                className="bg-slate-800 text-white p-2 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsScreenshotExpanded(false);
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="bg-slate-900 w-full flex-1 flex justify-center items-center p-2 overflow-auto" onClick={() => setIsScreenshotExpanded(false)}>
                            <img
                                src={formData.screenshotUrl}
                                alt="Expanded screenshot"
                                className="max-w-full max-h-full object-contain cursor-zoom-out"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
