import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Tag, DollarSign, User, FileText, Calendar, Pencil, Check } from 'lucide-react';

export default function EventDetailModal({ event, onClose, onSave }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(null);

    useEffect(() => {
        if (event) {
            setForm({
                title: event.title || '',
                date: event.date || '',
                time: event.time || '',
                endTime: event.fullData?.endTime || '',
                location: event.fullData?.location || '',
                host: event.fullData?.host || '',
                cost: event.fullData?.cost || '',
                notes: event.fullData?.notes || '',
                typeTags: event.fullData?.typeTags || [],
                type: event.type || '',
            });
            setEditing(false);
        }
    }, [event]);

    if (!event || !form) return null;

    const handleSave = () => {
        const updated = {
            ...event,
            title: form.title,
            time: form.time,
            type: form.type,
            fullData: {
                ...event.fullData,
                location: form.location,
                host: form.host,
                cost: form.cost,
                notes: form.notes,
                endTime: form.endTime,
                typeTags: form.typeTags,
            },
        };
        onSave(updated);
        setEditing(false);
    };

    const Field = ({ icon: Icon, label, value, field, multiline }) => (
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
            <Icon size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                {editing && field ? (
                    multiline ? (
                        <textarea
                            className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            value={form[field]}
                            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        />
                    ) : (
                        <input
                            className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form[field]}
                            onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        />
                    )
                ) : (
                    <p className="text-sm text-slate-800 break-words">{value || <span className="text-slate-300 italic">—</span>}</p>
                )}
            </div>
        </div>
    );

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-slate-100">
                    <div className="flex-1 min-w-0 pr-4">
                        {editing ? (
                            <input
                                className="w-full text-lg font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            />
                        ) : (
                            <h2 className="text-lg font-bold text-slate-900 leading-tight">{form.title}</h2>
                        )}
                        {form.type && (
                            <span className="mt-1 inline-block bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                {form.type}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {editing ? (
                            <button
                                onClick={handleSave}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Save changes"
                            >
                                <Check size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit event"
                            >
                                <Pencil size={18} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-2">
                    <Field icon={Calendar} label="Date" value={`Day ${form.date}`} field={null} />
                    <Field icon={Clock} label="Time" value={form.time + (form.endTime ? ` – ${form.endTime}` : '')} field="time" />
                    <Field icon={MapPin} label="Location" value={form.location} field="location" />
                    <Field icon={User} label="Host" value={form.host} field="host" />
                    <Field icon={DollarSign} label="Cost" value={form.cost} field="cost" />
                    <Field
                        icon={Tag}
                        label="Tags"
                        value={Array.isArray(form.typeTags) ? form.typeTags.join(', ') : form.typeTags}
                        field={null}
                    />
                    <Field icon={FileText} label="Notes" value={form.notes} field="notes" multiline />
                </div>

                {/* Footer */}
                {editing && (
                    <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
                        <button
                            onClick={() => { setEditing(false); }}
                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
