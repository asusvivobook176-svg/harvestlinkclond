import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bug, Upload, CheckCircle, Loader2, Leaf, AlertTriangle } from 'lucide-react';

interface DetectionResult {
    pest: string;
    confidence: number;
    severity: 'Low' | 'Medium' | 'High';
    treatment: string;
    organic: string;
}

export const PestDetection: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<DetectionResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MOCK_RESULTS: DetectionResult[] = [
        { pest: 'Leaf Miner', confidence: 94, severity: 'Medium', treatment: 'Apply Chlorpyrifos 20 EC @ 2ml/L', organic: 'Neem oil spray 3ml/L, trap crops' },
        { pest: 'Aphids', confidence: 89, severity: 'Low', treatment: 'Imidacloprid 200 SL @ 0.5ml/L', organic: 'Soap water spray, ladybird beetles' },
        { pest: 'Late Blight', confidence: 97, severity: 'High', treatment: 'Mancozeb 75 WP @ 2g/L', organic: 'Copper-based fungicide, remove infected leaves' },
    ];

    const handleImageUpload = (files: FileList | null) => {
        if (!files || !files[0]) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setImageUrl(e.target?.result as string);
            setResult(null);
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = () => {
        if (!imageUrl) return;
        setIsAnalyzing(true);
        setResult(null);
        // Simulate AI analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult(MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]);
        }, 2500);
    };

    const severityColors = {
        Low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        Medium: 'text-amber-600 bg-amber-50 border-amber-200',
        High: 'text-rose-600 bg-rose-50 border-rose-200',
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-linear-to-br from-rose-600 to-orange-500 p-8 text-white">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                    <Bug className="w-6 h-6" /> AI Pest & Disease Detective
                </h2>
                <p className="text-rose-100/70 text-sm">Upload a photo of your crop and our AI will identify pests, diseases, and recommend treatment.</p>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload */}
                    <div>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); }}
                            className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 hover:border-rose-300 transition-all aspect-square flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-rose-50/30 relative overflow-hidden"
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="Uploaded crop" className="absolute inset-0 object-cover w-full h-full rounded-2xl" />
                            ) : (
                                <>
                                    <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center"><Upload size={24} /></div>
                                    <div className="text-center px-6">
                                        <p className="font-black text-sm text-gray-900">Click or drag & drop</p>
                                        <p className="text-xs text-gray-400 mt-1">Upload a clear photo of the affected leaf or plant</p>
                                    </div>
                                </>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
                        </div>

                        {imageUrl && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={analyzeImage}
                                disabled={isAnalyzing}
                                className="w-full mt-4 py-4 rounded-xl bg-rose-600 text-white font-black text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-75"
                            >
                                {isAnalyzing ? <><Loader2 className="animate-spin" size={18} /> Analyzing with AI...</> : <><Bug size={18} /> Run Pest Analysis</>}
                            </motion.button>
                        )}
                    </div>

                    {/* Results */}
                    <div className="flex flex-col justify-center">
                        {!imageUrl && !result && (
                            <div className="text-center text-gray-400 py-12">
                                <Leaf size={48} className="mx-auto mb-4 opacity-30" />
                                <p className="font-black text-sm uppercase tracking-widest">Upload an Image</p>
                                <p className="text-xs mt-1">Results will appear here</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="text-center py-12">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                                    <Loader2 size={48} className="mx-auto text-rose-500" />
                                </motion.div>
                                <p className="font-black text-sm text-gray-900 mt-4">AI is scanning the image...</p>
                                <p className="text-xs text-gray-400 mt-1">Checking against 500+ disease patterns</p>
                            </div>
                        )}

                        {result && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Detected</p>
                                        <h3 className="text-2xl font-black text-gray-900">{result.pest}</h3>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1 text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <p className="text-2xl font-black text-gray-900">{result.confidence}%</p>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-0.5">Confidence</p>
                                    </div>
                                    <div className={`flex-1 text-center p-4 rounded-xl border ${severityColors[result.severity]}`}>
                                        <p className="text-2xl font-black">{result.severity}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-70">Severity</p>
                                    </div>
                                </div>

                                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-1"><AlertTriangle size={12} /> Chemical Treatment</p>
                                        <button className="text-[10px] font-bold text-rose-600 hover:underline">Find Supplier</button>
                                    </div>
                                    <p className="text-sm font-bold text-rose-900">{result.treatment}</p>
                                </div>

                                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-1"><Leaf size={12} /> Organic Alternative</p>
                                        <button className="text-[10px] font-bold text-emerald-600 hover:underline">Find Supplier</button>
                                    </div>
                                    <p className="text-sm font-bold text-emerald-900">{result.organic}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 transition-all">Save to History</button>
                                    <button className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 transition-all">Generate Report</button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
