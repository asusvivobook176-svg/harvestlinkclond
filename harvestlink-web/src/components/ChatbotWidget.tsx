import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Upload, Loader, Languages, Info, ChevronDown } from 'lucide-react';
// @ts-ignore
import { apiCall } from '../lib/api';

type Language = 'en' | 'ta';

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Array<{
        role: 'user' | 'bot';
        content: string;
        language?: Language;
        metadata?: any;
    }>>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState<Language>('en');
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
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

        const userMessage = text;
        setMessages(prev => [...prev, { role: 'user', content: userMessage, language }]);
        setInput('');
        setLoading(true);

        try {
            const response = await apiCall('POST', '/api/chatbot/ask', {
                query: userMessage,
                language: language
            });

            setMessages(prev => [...prev, {
                role: 'bot',
                content: response.response,
                language: response.language,
                metadata: {
                    query_type: response.query_type,
                    suggestions: response.suggestions
                }
            }]);

            if (response.query_type === 'disease_diagnosis' && response.suggestions?.includes('image_upload')) {
                setShowImageUpload(true);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: language === 'en' ? 'Sorry, I had trouble understanding that.' : 'மன்னிக்கவும், என்னால் புரிந்து கொள்ள முடியவில்லை.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('language', language);

        try {
            setLoading(true);
            const response = await apiCall('POST', '/api/disease/detect', formData as any);

            const botMessage = language === 'en'
                ? `🔍 Disease Detected: ${response.disease}
Confidence: ${(response.confidence * 100).toFixed(1)}%
Severity: ${response.severity}

Treatment: ${response.natural_solution}
Mix: ${response.mix_ratio}
Frequency: ${response.spray_frequency}

I've created a monitoring case for you. Follow-up reminders scheduled.`
                : `🔍 நோய் கண்டறியப்பட்டது: ${response.disease}
உறுதி: ${(response.confidence * 100).toFixed(1)}%
தீவிரம்: ${response.severity}

சிகிச்சை: ${response.natural_solution}
கலவை: ${response.mix_ratio}
தெளிக்கும் முறை: ${response.spray_frequency}

நான் இதை தொடர்ந்து கண்காணிப்பேன்.`;

            setMessages(prev => [...prev, {
                role: 'bot',
                content: botMessage,
                language,
                metadata: response
            }]);
            setShowImageUpload(false);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: language === 'en' ? 'Could not analyze image. Try again!' : 'படத்தைப் பகுப்பாய்வு செய்ய முடியவில்லை. மீண்டும் முயலவும்!'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 z-50 transition-all hover:scale-110 flex items-center justify-center group"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">AI</span>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl flex flex-col h-[600px] z-50 border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">HarvestLink Agri AI</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-green-100 font-medium">Always Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setShowLangMenu(!showLangMenu)}
                                    className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-xs transition-colors"
                                >
                                    <Languages size={14} />
                                    <span>{language === 'en' ? 'English' : 'தமிழ்'}</span>
                                    <ChevronDown size={12} />
                                </button>
                                {showLangMenu && (
                                    <div className="absolute top-full right-0 mt-1 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-100 min-w-[100px]">
                                        <button
                                            onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-green-50 ${language === 'en' ? 'text-green-600 font-bold' : ''}`}
                                        >
                                            English
                                        </button>
                                        <button
                                            onClick={() => { setLanguage('ta'); setShowLangMenu(false); }}
                                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-green-50 ${language === 'ta' ? 'text-green-600 font-bold' : ''}`}
                                        >
                                            தமிழ்
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6">
                                <div className="bg-green-100 p-4 rounded-full text-green-600">
                                    <Info size={32} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">
                                        {language === 'en' ? 'Welcome to HarvestLink!' : 'ஹார்வெஸ்ட்லிங்க்-க்கு வரவேற்கிறோம்!'}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {language === 'en'
                                            ? 'Ask me about crops, organic fertilizers, or upload a photo to diagnose diseases.'
                                            : 'பயிர்கள், இயற்கை உரங்கள் பற்றி கேளுங்கள், அல்லது நோய் கண்டறிய புகைப்படத்தை பதிவேற்றவும்.'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 w-full pt-4">
                                    {[
                                        language === 'en' ? 'Tomato diseases' : 'தக்காளி நோய்கள்',
                                        language === 'en' ? 'Natural fertilizers' : 'இயற்கை உரங்கள்',
                                        language === 'en' ? 'Organic farming' : 'இயற்கை விவசாயம்',
                                        language === 'en' ? 'Market prices' : 'சந்தை விலைகள்'
                                    ].map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(s)}
                                            className="text-[11px] bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 p-2 rounded-lg text-gray-600 font-medium transition-all"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${msg.role === 'user'
                                            ? 'bg-green-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 px-1 capitalize">
                                        {msg.role === 'user' ? 'You' : 'Assistant'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                    <Loader className="animate-spin text-green-600" size={16} />
                                    <span className="text-xs text-gray-400 font-medium italic">AI is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {showImageUpload && (
                        <div className="border-t p-4 bg-green-50/50 animate-in slide-in-from-bottom-full duration-300">
                            <label className="flex flex-col items-center gap-2 cursor-pointer p-4 bg-white rounded-xl border-2 border-dashed border-green-200 hover:border-green-600 hover:bg-green-50 transition-all text-green-700">
                                <Upload size={24} className="mb-1" />
                                <span className="text-sm font-bold">
                                    {language === 'en' ? 'Upload Leaf Image' : 'இலைப் புகைப்படத்தைப் பதிவேற்றவும்'}
                                </span>
                                <span className="text-[11px] text-gray-400">Supported: JPG, PNG • Max 5MB</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            handleImageUpload(e.target.files[0]);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}

                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder={language === 'en' ? "Type your message..." : "உங்கள் செய்தியைத் தட்டச்சு செய்க..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-sm transition-all"
                                disabled={loading}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={loading || !input.trim()}
                                className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">
                            HarvestLink AI can make mistakes. Verify important info.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
