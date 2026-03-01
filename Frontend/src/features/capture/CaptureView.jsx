import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Terminal } from 'lucide-react';
import { extractEventFromImage } from '../../utils/extractEventFromImage';

export default function CaptureView({ onExtractionComplete, sharedFile }) {
    const [logs, setLogs] = useState([
        "> INITIALIZING SYSTEM...",
        "> AWAITING IMAGE INPUT_"
    ]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-scroll log
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // If a shared file was injected (from mobile share target), process it automatically
    useEffect(() => {
        if (sharedFile) {
            processFile(sharedFile);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sharedFile]);

    const addLog = (msg) => setLogs(prev => [...prev, msg]);

    const processFile = async (file) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setIsDragActive(false);

        addLog(`> FILE RECEIVED: ${file.name || 'shared-image'}`);
        addLog('> SENDING TO GEMINI AI...');
        addLog('> EXTRACTING EVENT METADATA...');

        try {
            const data = await extractEventFromImage(file);
            addLog('> PARSING COMPLETE. VALIDATING...');
            addLog('> EXTRACTION SUCCESSFUL. LOADING VERIFICATION VIEW.');
            setTimeout(() => {
                if (onExtractionComplete) onExtractionComplete(data);
            }, 600);
        } catch (err) {
            addLog(`> ERROR: ${err.message}`);
            addLog('> EXTRACTION FAILED. PLEASE TRY AGAIN.');
            setIsProcessing(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) processFile(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleClick = () => {
        if (!isProcessing) fileInputRef.current?.click();
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
                {/* Dropzone Area */}
                <div
                    className={`lg:col-span-2 border-2 border-dashed rounded-xl transition-colors relative
                        ${isProcessing ? 'border-blue-400 bg-blue-50 cursor-not-allowed' :
                            isDragActive ? 'border-blue-500 bg-blue-50 cursor-copy' :
                                'border-slate-300 bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50/50'
                        } flex flex-col items-center justify-center`}
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={() => setIsDragActive(false)}
                >
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                    </div>

                    <div className="flex flex-col items-center gap-4 text-slate-400">
                        <UploadCloud
                            size={48}
                            strokeWidth={1.5}
                            className={`${isProcessing ? 'text-blue-400 animate-pulse' : isDragActive ? 'text-blue-500' : 'text-slate-400'} transition-colors`}
                        />
                        <div className="text-center font-mono">
                            {isProcessing ? (
                                <>
                                    <p className="text-lg font-semibold tracking-tight text-blue-600">ANALYZING IMAGE...</p>
                                    <p className="text-xs uppercase tracking-widest mt-2 text-slate-400">Gemini AI is extracting event details</p>
                                </>
                            ) : (
                                <>
                                    <p className={`text-lg transition-colors font-semibold tracking-tight ${isDragActive ? 'text-blue-600' : 'text-slate-600'}`}>
                                        DRAG &amp; DROP SCREENSHOT
                                    </p>
                                    <p className="text-xs uppercase tracking-widest mt-2 text-slate-400">or click to browse files</p>
                                </>
                            )}
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Extraction Log */}
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


