import { useState, useRef, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    Calculator,
    FileText,
    Search,
    X,
    ChevronRight,
    MapPin,
    Store,
    Truck,
    Target
} from 'lucide-react';
// @ts-ignore
import { apiCall } from '../lib/api';

type UserType = 'shop_owner' | 'wholesale_trader';

export function MarketChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string; type?: string }>>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<UserType>('shop_owner');
    const [location, setLocation] = useState('Coimbatore');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (textOverride?: string) => {
        const text = textOverride || input;
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setInput('');
        setLoading(true);

        try {
            const response = await apiCall('POST', '/api/market-chatbot/ask', {
                query: text,
                user_type: userType,
                location: location
            });

            setMessages(prev => [...prev, { role: 'bot', content: response.response, type: response.crop ? 'market_data' : 'general' }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: 'Market intelligence service is temporarily unavailable.' }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { label: 'Price Trends', icon: <TrendingUp size={16} />, query: 'Show me tomato price trends' },
        { label: 'Find Suppliers', icon: <Users size={16} />, query: 'Best suppliers for onion' },
        { label: 'Profit Calc', icon: <Calculator size={16} />, query: 'Calculate profit for chilli' },
        { label: 'Demand Report', icon: <FileText size={16} />, query: 'Show high demand crops now' }
    ];

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50 transition-all hover:scale-110 flex items-center justify-center group"
                >
                    <TrendingUp size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">TRADER</span>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-4 left-4 w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col h-[650px] z-50 border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white p-5 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-base tracking-tight">Market Intelligence</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <MapPin size={10} /> {location}
                                    </span>
                                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Target size={10} /> {userType === 'shop_owner' ? 'Retailer' : 'Trader'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80">
                        {messages.length === 0 && (
                            <div className="space-y-6">
                                {/* Profile Selection */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Users size={14} /> Select Your Profile
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setUserType('shop_owner')}
                                            className={`p-3 rounded-xl border text-left transition-all ${userType === 'shop_owner' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-50 border-gray-100'}`}
                                        >
                                            <Store size={18} className={userType === 'shop_owner' ? 'text-blue-600' : 'text-gray-400'} />
                                            <div className="mt-2 font-bold text-sm">Shop Owner</div>
                                            <div className="text-[10px] text-gray-500">Retail & Local Market</div>
                                        </button>
                                        <button
                                            onClick={() => setUserType('wholesale_trader')}
                                            className={`p-3 rounded-xl border text-left transition-all ${userType === 'wholesale_trader' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-gray-50 border-gray-100'}`}
                                        >
                                            <Truck size={18} className={userType === 'wholesale_trader' ? 'text-indigo-600' : 'text-gray-400'} />
                                            <div className="mt-2 font-bold text-sm">Wholesale</div>
                                            <div className="text-[10px] text-gray-500">Bulk & Inter-state</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Tools */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Market Analyst Tools</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSendMessage(action.query)}
                                                className="bg-white p-3 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-3 group"
                                            >
                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    {action.icon}
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                                    <Search className="text-blue-600 shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-sm font-bold text-blue-900">Expert Market Analysis</p>
                                        <p className="text-xs text-blue-800/70 mt-1 leading-relaxed">
                                            I use real-time data from 50+ Tamil Nadu mandis to provide price forecasts and supplier networks.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[90%]`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl shadow-sm text-[13px] ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap leading-relaxed">
                                            {msg.content}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1.5 px-1 font-medium italic">
                                        {msg.role === 'user' ? 'Strategy Request' : 'Analysis Result'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">crunching market data</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Analyze crop or market..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="w-full bg-gray-50 border-none rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
                                    disabled={loading}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                                    <Search size={18} />
                                </div>
                            </div>
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={loading || !input.trim()}
                                className="bg-blue-600 text-white p-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <div className="flex justify-center gap-4 mt-3">
                            <button onClick={() => setLocation('Chennai')} className="text-[10px] text-gray-400 hover:text-blue-600 font-bold transition-colors">Chennai</button>
                            <button onClick={() => setLocation('Coimbatore')} className="text-[10px] text-gray-400 hover:text-blue-600 font-bold transition-colors underline decoration-blue-500 underline-offset-4">Coimbatore</button>
                            <button onClick={() => setLocation('Madurai')} className="text-[10px] text-gray-400 hover:text-blue-600 font-bold transition-colors">Madurai</button>
                            <button onClick={() => setLocation('Salem')} className="text-[10px] text-gray-400 hover:text-blue-600 font-bold transition-colors">Salem</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
