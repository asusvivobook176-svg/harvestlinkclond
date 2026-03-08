import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Landmark, CheckCircle } from 'lucide-react';

interface Scheme {
    id: number;
    name: string;
    description: string;
    benefit: string;
    eligibility: string;
    link: string;
}

const schemes: Scheme[] = [
    {
        id: 1,
        name: 'PM Kisan Samman Nidhi',
        description: 'Direct income support provides a stable financial floor for small and marginal farmers.',
        benefit: '₹6,000 per year (3 installments)',
        eligibility: 'Land holding < 2 hectares',
        link: 'https://pmkisan.gov.in/'
    },
    {
        id: 2,
        name: 'PM Fasal Bima Yojana',
        description: 'Comprehensive insurance cover against crop failure, helping stabilize farmer income.',
        benefit: 'Up to 72% claim on total loss',
        eligibility: 'All food & oilseed crops',
        link: 'https://pmfby.gov.in/'
    },
    {
        id: 3,
        name: 'Soil Health Card Scheme',
        description: 'Promotes soil test based and balanced use of fertilizers to reduce production cost.',
        benefit: 'Free soil testing & reports',
        eligibility: 'All land-owning farmers',
        link: 'https://soilhealth.dac.gov.in/'
    },
    {
        id: 4,
        name: 'Drip Irrigation Subsidy',
        description: 'Financial assistance for installing micro-irrigation systems to improve water use efficiency.',
        benefit: '50-80% subsidy on equipment',
        eligibility: 'Priority for water-scarce regions',
        link: '#'
    },
];

export const GovernmentSchemes: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    <Landmark className="w-6 h-6 text-emerald-600" /> Government Schemes
                </h2>
                <p className="text-gray-500 text-sm mb-8">Access critical subsidies and financial support programs tailored for your farm.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    {schemes.map(scheme => (
                        <motion.div
                            key={scheme.id}
                            whileHover={{ y: -5 }}
                            className="group p-6 rounded-2xl border-2 border-gray-50 hover:border-emerald-100 bg-gray-50/30 hover:bg-white transition-all cursor-pointer hover:shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                                    {scheme.name}
                                </h3>
                                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                            </div>

                            <p className="text-sm text-gray-500 mb-6 line-clamp-2">{scheme.description}</p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                        <span className="text-emerald-600 font-bold text-sm">₹</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Primary Benefit</p>
                                        <p className="font-bold text-gray-900 text-sm">{scheme.benefit}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Eligibility</p>
                                        <p className="font-bold text-gray-900 text-sm">{scheme.eligibility}</p>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={scheme.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 block w-full text-center py-3 rounded-xl bg-white border border-gray-200 text-sm font-black text-gray-900 hover:bg-emerald-600 hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                Apply Now
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
