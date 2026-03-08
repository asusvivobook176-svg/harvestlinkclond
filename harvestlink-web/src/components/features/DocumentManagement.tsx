import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Trash2, Download, Search, FolderOpen } from 'lucide-react';

interface Document {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadedAt: Date;
    category: 'Land Records' | 'Insurance' | 'Soil Reports' | 'Invoices' | 'Certificates';
}

const CATEGORY_COLORS: Record<Document['category'], string> = {
    'Land Records': 'bg-amber-100 text-amber-700',
    'Insurance': 'bg-blue-100 text-blue-700',
    'Soil Reports': 'bg-emerald-100 text-emerald-700',
    'Invoices': 'bg-purple-100 text-purple-700',
    'Certificates': 'bg-rose-100 text-rose-700',
};

const initialDocs: Document[] = [
    { id: 1, name: 'Land Registration Deed 2021.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: new Date('2024-01-15'), category: 'Land Records' },
    { id: 2, name: 'PM Fasal Bima Policy 2024.pdf', type: 'PDF', size: '1.8 MB', uploadedAt: new Date('2024-03-01'), category: 'Insurance' },
    { id: 3, name: 'Soil Test Report Q4 2024.pdf', type: 'PDF', size: '540 KB', uploadedAt: new Date('2024-10-20'), category: 'Soil Reports' },
];

export const DocumentManagement: React.FC = () => {
    const [docs, setDocs] = useState<Document[]>(initialDocs);
    const [search, setSearch] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filtered = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

    const handleUpload = (files: FileList | null) => {
        if (!files) return;
        Array.from(files).forEach(file => {
            const newDoc: Document = {
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                size: `${(file.size / 1024).toFixed(0)} KB`,
                uploadedAt: new Date(),
                category: 'Invoices',
            };
            setDocs(prev => [newDoc, ...prev]);
        });
    };

    const handleDelete = (id: number) => setDocs(prev => prev.filter(d => d.id !== id));

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    <FolderOpen className="w-6 h-6 text-emerald-600" /> Document Vault
                </h2>
                <p className="text-gray-500 text-sm mb-8">Securely store and access all your farm documents in one place.</p>

                {/* Drag & Drop Upload */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer mb-8 rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 transition-all ${dragOver ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                        }`}
                >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                        <Upload size={28} />
                    </div>
                    <div className="text-center">
                        <p className="font-black text-sm text-gray-900">Drop files here or click to upload</p>
                        <p className="text-xs font-medium text-gray-400 mt-1">Supports PDF, JPEG, PNG, DOCX (Max 25 MB)</p>
                    </div>
                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search documents..."
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-hidden text-sm font-medium transition-all"
                    />
                </div>

                {/* Document List */}
                <div className="space-y-3">
                    <AnimatePresence initial={false}>
                        {filtered.map(doc => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/20 hover:bg-white hover:shadow-md transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-sm text-gray-900 truncate">{doc.name}</p>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                        {doc.type} · {doc.size} · {doc.uploadedAt.toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg shrink-0 ${CATEGORY_COLORS[doc.category]}`}>
                                    {doc.category}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"><Download size={16} /></button>
                                    <button onClick={() => handleDelete(doc.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <span className="text-4xl mb-4 block">📂</span>
                            <p className="text-sm font-black">No documents found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
