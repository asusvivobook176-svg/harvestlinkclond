import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'ta' : 'en';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
        >
            <Languages className="w-3.5 h-3.5" />
            <span>{i18n.language === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>
    );
};
