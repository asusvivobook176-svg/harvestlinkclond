import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Pin } from 'lucide-react';

interface Event {
    date: number;
    month: number;
    year: number;
    event: string;
    crop: string;
    type: 'planting' | 'harvest' | 'maintenance' | 'fertilize';
}

export const CropCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events] = useState<Event[]>([
        { date: 15, month: currentDate.getMonth(), year: currentDate.getFullYear(), event: 'Plant Tomatoes', crop: 'Tomato', type: 'planting' },
        { date: 28, month: currentDate.getMonth(), year: currentDate.getFullYear(), event: 'Harvest Beans', crop: 'Beans', type: 'harvest' },
        { date: 10, month: (currentDate.getMonth() + 1) % 12, year: currentDate.getFullYear(), event: 'Soil Treatment', crop: 'General', type: 'maintenance' },
    ]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const typeStyles = {
        planting: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        harvest: 'bg-orange-100 text-orange-700 border-orange-200',
        maintenance: 'bg-blue-100 text-blue-700 border-blue-200',
        fertilize: 'bg-amber-100 text-amber-700 border-amber-200',
    };

    const dayCells = [];
    for (let i = 0; i < firstDayOfMonth; i++) dayCells.push(null);
    for (let i = 1; i <= daysInMonth; i++) dayCells.push(i);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-emerald-600" /> Crop Calendar
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your seasonal timeline and farm activities.</p>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                        <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-emerald-600">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="px-6 font-black text-gray-900 min-w-[150px] text-center">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-emerald-600">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-8">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-black text-[10px] uppercase tracking-widest text-gray-400 py-3">
                            {day}
                        </div>
                    ))}

                    {dayCells.map((day, idx) => {
                        const dayEvent = events.find(e => e.date === day && e.month === currentDate.getMonth() && e.year === currentDate.getFullYear());

                        return (
                            <motion.div
                                key={idx}
                                whileHover={day ? { scale: 1.05, zIndex: 10 } : {}}
                                className={`min-h-[100px] p-3 rounded-xl border-2 transition-all group flex flex-col justify-between ${day
                                        ? dayEvent
                                            ? `${typeStyles[dayEvent.type]} border-current shadow-sm`
                                            : 'bg-gray-50/50 border-transparent hover:border-emerald-200 hover:bg-white hover:shadow-md'
                                        : 'bg-transparent border-transparent opacity-0'
                                    }`}
                            >
                                {day && (
                                    <>
                                        <span className="font-black text-lg">{day}</span>
                                        {dayEvent && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                                className="text-[10px] font-black uppercase tracking-tight leading-tight mt-2"
                                            >
                                                <div className="mb-1 opacity-60">{dayEvent.crop}</div>
                                                {dayEvent.event}
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Upcoming Section */}
                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-sm font-black text-gray-900 mb-5 flex items-center gap-2 uppercase tracking-widest">
                        <Pin className="w-4 h-4 text-emerald-600" /> Key Farm Milestones
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {events.map((event, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-5 rounded-2xl flex items-center justify-between border-l-4 ${typeStyles[event.type]} shadow-sm`}
                            >
                                <div>
                                    <p className="font-black text-gray-900">{event.event}</p>
                                    <p className="text-xs font-medium opacity-70">
                                        {new Date(event.year, event.month, event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="bg-white/50 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-xs">
                                    {event.crop}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
