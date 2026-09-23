// Notificaciones flotantes de éxito y error
// Un ToastProvider global en main, useToast para disparar

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ToastType = "success" | "error";

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast debe usarse dentro de <ToastProvider>");
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const nextId = useRef(1);

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message: string, type: ToastType = "success") => {
        const id = nextId.current++;
        setToasts((current) => [...current, { id, message, type }]);
        setTimeout(() => dismiss(id), 4000);
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role={t.type === "error" ? "alert" : "status"}
                        onClick={() => dismiss(t.id)}
                        className={`cursor-pointer rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${t.type === "error" ? "bg-red-600" : "bg-emerald-600"}`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
