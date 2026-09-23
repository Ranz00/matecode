// Card individual de cada tarea

import { useState, type FormEvent } from "react";
import type { Task } from "../types";
import { formClass, inputClass, smallPrimaryBtnClass, smallDangerBtnClass, smallGrayBtnClass } from "../styles/theme";

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
            <div className="mb-3 rounded-lg bg-white p-4 shadow dark:bg-slate-900">
                <form onSubmit={handleSave} className={formClass}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={inputClass}
                        required
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputClass}
                        placeholder="Descripción..."
                    />
                    <div className="flex gap-2">
                        <button type="submit" disabled={loading} className={smallPrimaryBtnClass}>
                            Guardar
                        </button>
                        <button type="button" onClick={() => setEditing(false)} className={smallGrayBtnClass}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="mb-3 rounded-lg bg-white p-4 shadow dark:bg-slate-900">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id, task.completed)}
                    className="h-5 w-5 cursor-pointer accent-violet-600"
                />
                <div className="flex-1">
                    <p className={`text-base font-medium text-slate-900 dark:text-white ${task.completed ? "line-through opacity-60" : ""}`}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {task.description}
                        </p>
                    )}
                </div>
                <button onClick={() => setEditing(true)} className={smallPrimaryBtnClass}>
                    Editar
                </button>
                <button onClick={() => onDelete(task.id)} disabled={loading} className={smallDangerBtnClass}>
                    Eliminar
                </button>
            </div>
        </div>
    );
}
