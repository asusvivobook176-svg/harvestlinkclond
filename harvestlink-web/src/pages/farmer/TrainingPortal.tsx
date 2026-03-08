import { Sidebar } from "../../components/layout/Sidebar";
import {
    PlayCircle,
    FileText,
    MessageCircle,
    PhoneCall,
    Download,
    ExternalLink,
    BookOpen,
    HelpCircle,
    ChevronRight,
    Youtube
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TrainingPortal() {

    const tutorials = [
        { id: 1, title: "Getting Started", duration: "3 min", bilingual: true, thumb: "bg-emerald-500" },
        { id: 2, title: "Crop Advisor Guide", duration: "4 min", bilingual: true, thumb: "bg-blue-500" },
        { id: 3, title: "Price Alerts Tutorial", duration: "3 min", bilingual: true, thumb: "bg-amber-500" },
        { id: 4, title: "Spoilage Checker", duration: "3 min", bilingual: true, thumb: "bg-red-500" },
        { id: 5, title: "Marketplace Overview", duration: "4 min", bilingual: true, thumb: "bg-indigo-500" },
        { id: 6, title: "Troubleshooting Tips", duration: "3 min", bilingual: true, thumb: "bg-purple-500" },
    ];

    const resources = [
        { title: "Farmer Manual (English)", size: "2.4 MB", type: "PDF" },
        { title: "Farmer Manual (Tamil)", size: "2.8 MB", type: "PDF" },
        { title: "Quick Start Guide", size: "1.2 MB", type: "PDF" },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="farmer" />

            <main className="flex-1 p-8 space-y-12 overflow-y-auto">
                {/* Header */}
                <div className="relative overflow-hidden bg-linear-to-r from-emerald-600 to-teal-500 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-emerald-200">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <BookOpen className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Pilot Program
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">Training Portal</h1>
                        <p className="max-w-xl text-emerald-50 text-lg font-medium">Master HarvestLink in minutes with our bilingual tutorials and step-by-step guides. We're here to help you grow.</p>
                    </div>
                </div>

                {/* Video Tutorials */}
                <section className="space-y-8">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                <Youtube className="w-8 h-8 text-red-600" /> Video Tutorials
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Watch & Learn in English or Tamil</p>
                        </div>
                        <button className="text-emerald-600 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            View All Videos <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tutorials.map((video) => (
                            <div key={video.id} className="group cursor-pointer">
                                <div className={`relative aspect-video rounded-[2rem] ${video.thumb} mb-4 overflow-hidden shadow-xl transition-all group-hover:scale-[1.02] group-hover:shadow-2xl`}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                            <PlayCircle className="w-10 h-10 text-slate-900" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded-lg text-[10px] font-black tracking-widest text-white backdrop-blur-md">
                                        {video.duration}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{video.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">BILINGUAL</span>
                                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded-md uppercase">4K HD</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Resources & Support */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Documentation */}
                    <section className="space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-600" /> Manuals & Resources
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">PDF Guides for Offline Reading</p>
                        </div>
                        <div className="space-y-4">
                            {resources.map((res, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{res.title}</h4>
                                            <p className="text-xs text-slate-400 font-black tracking-widest">{res.type} · {res.size}</p>
                                        </div>
                                    </div>
                                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Support Channels */}
                    <section className="space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                <HelpCircle className="w-8 h-8 text-purple-600" /> Need Help?
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">24/7 Support for Pilot Farmers</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <a href="#" className="p-8 bg-emerald-600 rounded-[2rem] text-white space-y-4 shadow-xl shadow-emerald-100 hover:translate-y-[-4px] transition-all group relative overflow-hidden">
                                <MessageCircle className="w-12 h-12 opacity-20 absolute -bottom-2 -right-2 scale-150" />
                                <MessageCircle className="w-10 h-10" />
                                <div>
                                    <h4 className="text-lg font-black leading-tight">Farmer WhatsApp Group</h4>
                                    <p className="text-emerald-100 text-sm mt-2">Connect with fellow farmers and get instant tips.</p>
                                </div>
                                <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                                    Join Now <ExternalLink className="w-3 h-3" />
                                </div>
                            </a>
                            <a href="#" className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-4 shadow-xl shadow-slate-200 hover:translate-y-[-4px] transition-all group relative overflow-hidden">
                                <PhoneCall className="w-12 h-12 opacity-10 absolute -bottom-2 -right-2 scale-150" />
                                <PhoneCall className="w-10 h-10 text-indigo-400" />
                                <div>
                                    <h4 className="text-lg font-black leading-tight">Farmer Helpline</h4>
                                    <p className="text-slate-400 text-sm mt-2">Call us anytime for technical assistance.</p>
                                </div>
                                <div className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                                    1800-HLINK-TN <ExternalLink className="w-3 h-3" />
                                </div>
                            </a>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
