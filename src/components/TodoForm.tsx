// Formulario para crear tareas

import { useState, type FormEvent } from "react";
import type { TaskFormValues } from "../types";
import { formClass, labelClass, inputClass, primaryBtnClass } from "../styles/theme";

interface Props {
    onAdd: (values: TaskFormValues) => void;
    loading: boolean;
}

export function TodoForm({ onAdd, loading }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({ title: title.trim(), description: description.trim() });
        setTitle("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit} className={`${formClass} mb-6`}>
            <div>
                <label className={labelClass}>Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="¿Qué tenés que hacer?"
                    required
                    className={inputClass}
                />
            </div>
            <div>
                <label className={labelClass}>Descripción (opcional)</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalle breve..."
                    className={inputClass}
                />
            </div>
            <button type="submit" disabled={loading || !title.trim()} className={primaryBtnClass}>
                {loading ? "Agregando..." : "Agregar tarea"}
            </button>
        </form>
    );
}
