import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Tag, DollarSign, User, FileText, Calendar, Pencil, Check, AlertCircle } from 'lucide-react';
export default function EventDetailModal({ event, onClose, onSave }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(null);
    const [errors, setErrors] = useState({});

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
            setErrors({});
        }
    }, [event]);

    if (!event || !form) return null;

    const validate = () => {
        const errs = {};
        if (!form.title?.trim())
            errs.title = 'Title is required.';
        if (form.time && !/^\d{2}:\d{2}$/.test(form.time))
            errs.time = 'Use HH:MM format (e.g. 14:30).';
        if (form.endTime && !/^\d{2}:\d{2}$/.test(form.endTime))
            errs.endTime = 'Use HH:MM format (e.g. 15:30).';
        if (form.time && form.endTime && form.endTime <= form.time)
            errs.endTime = 'End time must be after start time.';
        if (form.cost && form.cost.trim() !== '' && !/^(free|Free|\$[\d]+.*|\d+.*)$/i.test(form.cost.trim()))
            errs.cost = 'Use "Free", "$20", etc.';
        return errs;
    };

    const handleSave = () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
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

    const set = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }));
        // Clear error for field when user starts typing
        if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    };


    return (
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
                            <div>
                                <input
                                    className={`w-full text-lg font-bold text-slate-900 bg-slate-50 border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 ${errors.title ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 focus:ring-blue-500'}`}
                                    placeholder="Event title *"
                                    value={form.title}
                                    onChange={set('title')}
                                />
                                {errors.title && (
                                    <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                                        <AlertCircle size={11} /> {errors.title}
                                    </p>
                                )}
                            </div>
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
                    <Field form={form} editing={editing} errors={errors} set={set} icon={Calendar} label="Date" value={`Day ${form.date}`} field={null} />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={Clock} label="Start Time" value={form.time} field="time" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={Clock} label="End Time" value={form.endTime} field="endTime" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={MapPin} label="Location" value={form.location} field="location" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={User} label="Host" value={form.host} field="host" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={DollarSign} label="Cost" value={form.cost} field="cost" />
                    <Field
                        form={form} editing={editing} errors={errors} set={set}
                        icon={Tag}
                        label="Tags"
                        value={Array.isArray(form.typeTags) ? form.typeTags.join(', ') : form.typeTags}
                        field={null}
                    />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={FileText} label="Notes" value={form.notes} field="notes" multiline />
                </div>

                {/* Footer */}
                {editing && (
                    <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
                        <button
                            onClick={() => { setEditing(false); setErrors({}); }}
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
