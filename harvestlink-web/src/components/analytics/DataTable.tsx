import React, { useState } from 'react';
import { Download, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface Column {
    header: string;
    accessor: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    data: any[];
    columns: Column[];
    title: string;
    onExport?: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({ data, columns, title, onExport }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredData = sortedData.filter(row =>
        Object.values(row).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const downloadCSV = () => {
        const headers = columns.map(c => c.header).join(',');
        const rows = filteredData.map(row =>
            columns.map(c => row[c.accessor]).join(',')
        ).join('\n');
        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${title.toLowerCase().replace(/\s/g, '_')}_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={onExport || downloadCSV}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                        title="Export to CSV"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            {columns.map((col) => (
                                <th
                                    key={col.accessor}
                                    className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600"
                                    onClick={() => handleSort(col.accessor)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.header}
                                        {sortConfig?.key === col.accessor ? (
                                            sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        ) : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredData.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                {columns.map((col) => (
                                    <td key={col.accessor} className="px-6 py-4 text-sm text-slate-600">
                                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400 text-sm italic">
                                    No data found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
