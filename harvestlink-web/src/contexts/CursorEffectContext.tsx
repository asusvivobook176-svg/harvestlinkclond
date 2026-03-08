import { createContext, useContext, useState, type ReactNode } from 'react';

interface CursorEffectContextType {
    splashCursorEnabled: boolean;
    setSplashCursorEnabled: (enabled: boolean) => void;
}

const STORAGE_KEY = 'hl_splash_cursor_enabled';

const CursorEffectContext = createContext<CursorEffectContextType>({
    splashCursorEnabled: true,
    setSplashCursorEnabled: () => { },
});

export function CursorEffectProvider({ children }: { children: ReactNode }) {
    const [splashCursorEnabled, setSplashCursorEnabledState] = useState<boolean>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored === null ? true : stored === 'true';
        } catch {
            return true;
        }
    });

    const setSplashCursorEnabled = (enabled: boolean) => {
        setSplashCursorEnabledState(enabled);
        try {
            localStorage.setItem(STORAGE_KEY, String(enabled));
        } catch {
            // ignore
        }
    };

    return (
        <CursorEffectContext.Provider value={{ splashCursorEnabled, setSplashCursorEnabled }}>
            {children}
        </CursorEffectContext.Provider>
    );
}

export function useCursorEffect() {
    return useContext(CursorEffectContext);
}
