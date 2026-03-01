import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Tag, DollarSign, User, FileText, Calendar, Pencil, Check, AlertCircle, Trash2 } from 'lucide-react';
export default function EventDetailModal({ event, onClose, onSave, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState(null);
    const [errors, setErrors] = useState({});
    const [tagInput, setTagInput] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (event) {
            setForm({
                title: event.title || '',
                startDate: event.start_date || event.fullData?.start_date || '',
                endDate: event.end_date || event.fullData?.end_date || '',
                time: event.time || '',
                endTime: event.fullData?.endTime || '',
                location: event.fullData?.location || '',
                host: event.fullData?.host || '',
                cost: event.fullData?.cost || '',
                notes: event.fullData?.notes || '',
                typeTags: event.fullData?.typeTags || [],
                type: event.type || '',
            });
            setEditing(event.isNew || false);
            setErrors({});
        }
    }, [event]);

    if (!event || !form) return null;

    const validate = () => {
        const errs = {};
        if (!form.title?.trim())
            errs.title = 'Title is required.';
        if (form.startDate && form.endDate && form.endDate < form.startDate)
            errs.endDate = 'End date must be on or after start date.';
        if (form.time && !/^\d{2}:\d{2}$/.test(form.time))
            errs.time = 'Use HH:MM format (e.g. 14:30).';
        if (form.endTime && !/^\d{2}:\d{2}$/.test(form.endTime))
            errs.endTime = 'Use HH:MM format (e.g. 15:30).';
        if (form.time && form.endTime && form.startDate === form.endDate && form.endTime <= form.time)
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
            start_date: form.startDate,
            end_date: form.endDate || form.startDate,
            fullData: {
                ...event.fullData,
                location: form.location,
                host: form.host,
                cost: form.cost,
                notes: form.notes,
                endTime: form.endTime,
                typeTags: form.typeTags,
                end_date: form.endDate || form.startDate,
            },
        };
        onSave(updated);
        setEditing(false);
    };

    const set = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim().replace(/,$/, '');
            if (tag && !form.typeTags.includes(tag)) {
                setForm(f => ({ ...f, typeTags: [...f.typeTags, tag] }));
            }
            setTagInput('');
        } else if (e.key === 'Backspace' && tagInput === '' && form.typeTags.length > 0) {
            setForm(f => ({ ...f, typeTags: f.typeTags.slice(0, -1) }));
        }
    };

    const removeTag = (tag) => {
        setForm(f => ({ ...f, typeTags: f.typeTags.filter(t => t !== tag) }));
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
                    <Field form={form} editing={editing} errors={errors} set={set} icon={Calendar} label="Start Date" value={editing ? form.startDate : (form.startDate ? new Date(`${form.startDate}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '')} field="startDate" inputType="date" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={Calendar} label="End Date" value={editing ? form.endDate : (form.endDate && form.endDate !== form.startDate ? new Date(`${form.endDate}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '')} field="endDate" inputType="date" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={Clock} label="Start Time" value={form.time} field="time" inputType="time" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={Clock} label="End Time" value={form.endTime} field="endTime" inputType="time" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={MapPin} label="Location" value={form.location} field="location" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={User} label="Host" value={form.host} field="host" />
                    <Field form={form} editing={editing} errors={errors} set={set} icon={DollarSign} label="Cost" value={form.cost} field="cost" />
                    {/* Tags — custom chip editor */}
                    <div className="flex gap-3 mb-4">
                        <div className="mt-0.5 min-w-[20px] text-slate-400"><Tag size={18} /></div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 px-1">Tags</div>
                            <div className={`flex flex-wrap gap-1.5 items-center bg-slate-50 border rounded-lg px-3 py-2 min-h-[38px] ${editing ? 'border-slate-200 focus-within:ring-2 focus-within:ring-blue-500' : 'border-slate-100'
                                }`}>
                                {(form.typeTags || []).map(tag => (
                                    <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                        {tag}
                                        {editing && (
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="text-blue-400 hover:text-blue-700 leading-none"
                                                aria-label={`Remove ${tag}`}
                                            >
                                                <X size={11} />
                                            </button>
                                        )}
                                    </span>
                                ))}
                                {editing && (
                                    <input
                                        type="text"
                                        className="flex-1 min-w-[100px] bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                        placeholder={form.typeTags?.length ? 'Add tag…' : 'Type a tag, press Enter'}
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                    />
                                )}
                                {!editing && !(form.typeTags?.length) && (
                                    <span className="text-slate-400 italic text-sm">Not specified</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Field form={form} editing={editing} errors={errors} set={set} icon={FileText} label="Notes" value={form.notes} field="notes" multiline />
                </div>

                {/* Footer */}
                {editing && (
                    <div className="px-5 py-3 border-t border-slate-100 flex justify-between gap-2">
                        {/* Delete — only for existing (non-new) events */}
                        {!event.isNew && onDelete ? (
                            confirmDelete ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-red-500 font-semibold">Delete this event?</span>
                                    <button
                                        onClick={() => { onDelete(event); onClose(); }}
                                        className="px-3 py-1.5 text-xs bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={15} /> Delete
                                </button>
                            )
                        ) : <div />}
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setEditing(false); setErrors({}); setConfirmDelete(false); }}
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
                    </div>
                )}
            </div>
        </div>
    );
}

function Field({ form, editing, errors, set, icon: Icon, label, value, field, multiline = false, inputType = "text" }) {
    return (
        <div className="flex gap-3 mb-4 last:mb-0">
            <div className="mt-0.5 min-w-[20px] text-slate-400">
                {Icon && <Icon size={18} />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 px-1">
                    {label}
                </div>
                {editing && field ? (
                    <div>
                        {multiline ? (
                            <textarea
                                className={`w-full text-sm text-slate-900 bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 min-h-[80px] resize-y ${errors[field] ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 focus:ring-blue-500'}`}
                                value={value}
                                onChange={set(field)}
                            />
                        ) : (
                            <input
                                type={inputType}
                                className={`w-full text-sm text-slate-900 bg-slate-50 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors[field] ? 'border-red-400 focus:ring-red-300' : 'border-slate-200 focus:ring-blue-500'}`}
                                value={value}
                                onChange={set(field)}
                            />
                        )}
                        {errors[field] && (
                            <p className="flex items-center gap-1 text-red-500 text-[11px] mt-1 px-1">
                                {/* Note: AlertCircle must be imported at the top of the file */}
                                <AlertCircle size={10} /> {errors[field]}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className={multiline ? "text-sm text-slate-900 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 min-h-[38px] whitespace-pre-wrap break-words" : "text-sm text-slate-900 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 min-h-[38px] break-words"}>
                        {value || <span className="text-slate-400 italic">Not specified</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
