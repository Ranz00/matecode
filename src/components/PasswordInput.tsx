// Campo de contraseña con ojo para mostrar u ocultar
// El error lo maneja la página que lo usa

import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { labelClass, inputClass, errorClass } from "../styles/theme";

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
            <label htmlFor={inputId} className={labelClass}>{label}</label>
            <div style={{ position: "relative" }}>
                <input
                    id={inputId}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    required
                    className={inputClass}
                    style={{ paddingRight: "72px" }}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: "4px" }}
                >
                    {visible ? <FiEyeOff size={18} aria-hidden="true" /> : <FiEye size={18} aria-hidden="true" />}
                </button>
            </div>
            {error && <p className={errorClass}>{error}</p>}
        </div>
    );
}
