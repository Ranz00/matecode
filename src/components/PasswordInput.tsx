// Campo de contraseña con ojo para mostrar u ocultar
// El error lo maneja la página que lo usa

import { useId, useState } from "react";

interface PasswordInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string | null;
    onBlur?: () => void;
}

export function PasswordInput({ label, value, onChange, error, onBlur }: PasswordInputProps) {
    const [visible, setVisible] = useState(false);
    const inputId = useId();

    return (
        <div>
            <label htmlFor={inputId} className="label">{label}</label>
            <div style={{ position: "relative" }}>
                <input
                    id={inputId}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    required
                    className="input"
                    style={{ paddingRight: "72px" }}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#6b7280" }}
                >
                    {visible ? "Ocultar" : "Mostrar"}
                </button>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    );
}
