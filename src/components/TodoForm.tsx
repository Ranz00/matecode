// Formulario para crear tareas

import { useState, type FormEvent } from "react";

interface Props {
    onAdd: (title: string, description: string) => void;
    loading: boolean;
}

export function TodoForm({ onAdd, loading }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title.trim(), description.trim());
        setTitle("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit} className="form" style={{ marginBottom: "24px" }}>
            <div>
                <label className="label">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="¿Qué tenés que hacer?"
                    required
                    className="input"
                />
            </div>
            <div>
                <label className="label">Descripción (opcional)</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalle breve..."
                    className="input"
                />
            </div>
            <button type="submit" disabled={loading || !title.trim()} className="btn btn-primary">
                {loading ? "Agregando..." : "Agregar tarea"}
            </button>
        </form>
    );
}