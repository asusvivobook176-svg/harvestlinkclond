import { useState } from "react";
import { Settings, MousePointerClick, Save, CheckCircle2, Palette, Monitor } from "lucide-react";
import { Sidebar } from "../../components/layout/Sidebar";
import { useCursorEffect } from "../../contexts/CursorEffectContext";

export default function AdminSettings() {
    const { splashCursorEnabled, setSplashCursorEnabled } = useCursorEffect();

    // Local draft state — only committed on Save
    const [draft, setDraft] = useState({
        splashCursor: splashCursorEnabled,
    });
    const [saved, setSaved] = useState(false);

    const isDirty = draft.splashCursor !== splashCursorEnabled;

    const handleSave = () => {
        setSplashCursorEnabled(draft.splashCursor);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleReset = () => {
        setDraft({ splashCursor: splashCursorEnabled });
    };

    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar role="admin" />

            <div className="flex-1 flex flex-col min-w-0 text-slate-300">
                <main className="flex-1 p-6 space-y-6 max-w-3xl">

                    {/* Header */}
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Settings className="w-8 h-8 text-violet-400" />
                            Settings
                        </h1>
                        <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
                            Platform Configuration &amp; Preferences
                        </p>
                    </div>

                    {/* ── Visual Effects Section ───────────────────── */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Palette className="w-4 h-4 text-violet-400" />
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Visual Effects</h2>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            {/* Setting Row */}
                            <div className="p-5 flex items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <MousePointerClick className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Splash Cursor Effect</p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            Fluid WebGL simulation that renders a colorful ink-splash trail following
                                            the cursor across all pages. Disable to improve performance on low-end devices.
                                        </p>
                                        {/* Live preview badge */}
                                        <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${draft.splashCursor
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                : 'bg-slate-800 border-slate-700 text-slate-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${draft.splashCursor ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                                            {draft.splashCursor ? 'Enabled' : 'Disabled'}
                                        </div>
                                    </div>
                                </div>

                                {/* Toggle */}
                                <button
                                    onClick={() => setDraft(d => ({ ...d, splashCursor: !d.splashCursor }))}
                                    className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 shrink-0 ${draft.splashCursor
                                            ? 'bg-linear-to-r from-emerald-500 to-teal-400 focus:ring-emerald-500 shadow-lg shadow-emerald-500/30'
                                            : 'bg-slate-700 focus:ring-slate-600'
                                        }`}
                                    aria-checked={draft.splashCursor}
                                    role="switch"
                                    aria-label="Toggle Splash Cursor"
                                >
                                    <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${draft.splashCursor ? 'translate-x-7' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ── Display / UI Section ───────────────────── */}
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Monitor className="w-4 h-4 text-blue-400" />
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Display</h2>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-5 flex items-center justify-between gap-6 opacity-50 cursor-not-allowed select-none">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Monitor className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Compact Mode</p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            Reduce padding and font sizes across the dashboard for information density.
                                        </p>
                                        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-slate-800 border-slate-700 text-slate-600">
                                            Coming Soon
                                        </div>
                                    </div>
                                </div>
                                <div className="w-14 h-7 rounded-full bg-slate-800 shrink-0" />
                            </div>
                        </div>
                    </section>

                    {/* ── Save Bar ───────────────────────────────── */}
                    <div className={`sticky bottom-6 transition-all duration-300 ${isDirty ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xl shadow-black/60">
                            <p className="text-sm text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block mr-2 animate-pulse" />
                                You have unsaved changes
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Success Toast ───────────────────────────── */}
                    <div className={`fixed bottom-8 right-8 transition-all duration-500 z-50 ${saved ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <div className="bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center gap-3 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5" />
                            Settings saved successfully!
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
