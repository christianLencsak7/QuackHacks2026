import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Terminal } from 'lucide-react';

export default function CaptureView({ onExtractionComplete }) {
    const [logs, setLogs] = useState([
        "> INITIALIZING SYSTEM...",
        "> AWAITING IMAGE INPUT_"
    ]);
    const [isDragActive, setIsDragActive] = useState(false);
    const scrollRef = useRef(null);

    // Auto-scroll log
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Mock processing function
    const startMockExtraction = (e) => {
        if (e) e.preventDefault();
        setIsDragActive(false);

        setLogs(prev => [...prev, "> IMAGE DETECTED. ANALYZING IN 3..2..1.."]);

        // Simulate LLM extraction thinking
        let step = 0;
        const mockSteps = [
            "> EXTRACTING METADATA...",
            "> IDENTIFYING OBJECTS: [CALENDAR_EVENT, TIME_BLOCK]",
            "> PARSING TEXT CONTENT...",
            "> FOUND: 'Team Sync' @ 14:00 PST",
            "> RUNNING RE-VALIDATION CHECK...",
            "> EXTRACTION COMPLETE. READY."
        ];

        const interval = setInterval(() => {
            setLogs(prev => [...prev, mockSteps[step]]);
            step++;
            if (step >= mockSteps.length) {
                clearInterval(interval);
                setTimeout(() => {
                    const mockData = {
                        title: 'Team Sync',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date().toISOString().split('T')[0],
                        startTime: '14:00',
                        endTime: '16:00',
                        location: 'Room 304',
                        typeTags: ['Meeting', 'Work'],
                        cost: 'Free',
                        host: 'Manager',
                        notes: 'Please review the slide deck beforehand.',
                        screenshotUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400'
                    };
                    if (onExtractionComplete) {
                        onExtractionComplete(mockData);
                    }
                }, 1000);
            }
        }, 800);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    return (
        <div className="h-full w-full p-6 md:p-8 flex flex-col gap-6 bg-slate-50 text-slate-900">
            <header className="flex justify-between items-end border-b border-slate-200 pb-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Capture</h2>
                    <p className="text-slate-500 text-sm font-mono mt-1">Upload screenshot for automatic extraction</p>
                </div>
            </header>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dropzone Area (2/3 width on desktop) */}
                <div
                    className={`lg:col-span-2 border-2 border-dashed rounded-xl ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'} flex flex-col items-center justify-center transition-colors relative cursor-pointer`}
                    onClick={startMockExtraction}
                    onDrop={startMockExtraction}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDragActive(false)}
                >
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                    </div>

                    <div className="flex flex-col items-center gap-4 text-slate-400">
                        <UploadCloud size={48} strokeWidth={1.5} className={isDragActive ? "text-blue-500" : "text-slate-400"} />
                        <div className="text-center font-mono">
                            <p className={`text-lg transition-colors font-semibold tracking-tight ${isDragActive ? 'text-blue-600' : 'text-slate-600'}`}>DRAG & DROP SCREENSHOT</p>
                            <p className="text-xs uppercase tracking-widest mt-2 text-slate-400">or click to browse files</p>
                        </div>
                    </div>

                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="" />
                </div>

                {/* Real-time Extraction Log (1/3 width on desktop) */}
                <div className="border border-slate-200 bg-white rounded-xl shadow-sm flex flex-col h-full overflow-hidden shrink-0 min-h-[300px]">
                    <div className="border-b border-slate-100 p-3 flex items-center gap-2 bg-slate-50">
                        <Terminal size={14} className="text-slate-500" />
                        <span className="font-mono text-xs text-slate-600 tracking-wider uppercase font-semibold">Extraction_Log</span>
                    </div>
                    <div
                        ref={scrollRef}
                        className="flex-1 p-4 overflow-y-auto font-mono text-[11px] md:text-xs leading-relaxed text-slate-400 space-y-2 bg-slate-900"
                    >
                        {logs.map((log, i) => (
                            <div key={i} className={i === logs.length - 1 ? 'text-slate-100 font-semibold' : 'text-slate-400'}>
                                {log}
                            </div>
                        ))}
                        <span className="inline-block w-2 h-4 bg-slate-300 animate-pulse ml-1 align-middle" />
                    </div>
                </div>
            </div>
        </div>
    );
}
