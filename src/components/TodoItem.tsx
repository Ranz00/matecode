
// Card individual de cada tarea

import { useState, type FormEvent } from "react";
import type { Task } from "../types";

interface Props {
    task: Task;
    onToggle: (taskId: string, completed: boolean) => void;
    onUpdate: (taskId: string, title: string, description: string) => void;
    onDelete: (taskId: string) => void;
    loading: boolean;
}

export function TodoItem({ task, onToggle, onUpdate, onDelete, loading }: Props) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onUpdate(task.id, title.trim(), description.trim());
        setEditing(false);
    };

    if (editing) {
        return (
            <div className="card" style={{ maxWidth: "100%", marginBottom: "12px" }}>
                <form onSubmit={handleSave} className="form">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input"
                        required
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input"
                        placeholder="Descripción..."
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "auto" }}>
                            Guardar
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className="btn btn-danger" style={{ width: "auto", background: "#6b7280" }}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="card" style={{ maxWidth: "100%", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id, task.completed)}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
                <div style={{ flex: 1 }}>
                    <p style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        textDecoration: task.completed ? "line-through" : "none",
                        opacity: task.completed ? 0.6 : 1,
                        margin: 0,
                    }}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0" }}>
                            {task.description}
                        </p>
                    )}
                </div>
                <button onClick={() => setEditing(true)} className="btn btn-primary" style={{ width: "auto", padding: "6px 12px", fontSize: "14px" }}>
                    Editar
                </button>
                <button onClick={() => onDelete(task.id)} disabled={loading} className="btn btn-danger" style={{ width: "auto", padding: "6px 12px", fontSize: "14px" }}>
                    Eliminar
                </button>
            </div>
</div>
    );
}