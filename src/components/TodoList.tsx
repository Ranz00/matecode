import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";
import { createTask, toggleTaskCompleted, updateTask, deleteTask } from "../services/taskService";
import { sendEmail } from "../services/emailService";
import { useState } from "react";
import { FiSend, FiClipboard } from "react-icons/fi";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { useToast } from "./Toast";
import { errorClass } from "../styles/theme";
import type { TaskFormValues } from "../types";

export function TodoList() {
    const { user } = useAuth();
    const { toast } = useToast();
    const { tasks, loading, error } = useTasks(user?.uid);
    const [actionLoading, setActionLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

    const handleAdd = async ({ title, description }: TaskFormValues) => {
        if (!user) return;
        setActionLoading(true);
        try {
            await createTask(title, description, user.uid);
        } catch {
            toast("No se pudo agregar, intentá de nuevo", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggle = async (taskId: string, completed: boolean) => {
        setActionLoading(true);
        try {
            await toggleTaskCompleted(taskId, completed);
        } catch {
            toast("No se pudo guardar, intentá de nuevo", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (taskId: string, title: string, description: string) => {
        setActionLoading(true);
        try {
            await updateTask(taskId, { title, description });
        } catch {
            toast("No se pudo guardar, intentá de nuevo", "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (taskId: string) => {
        setActionLoading(true);
        try {
            await deleteTask(taskId);
        } catch {
            toast("No se pudo eliminar, intentá de nuevo", "error");
        } finally {
            setActionLoading(false);
        }
    };

    // Genera resumen de tareas y lo envía por email via SES
    const handleSendSummary = async () => {
        if (!user || !user.email) return;
        setEmailStatus("sending");
        try {
            const pending = tasks.filter((t) => !t.completed).length;
            const done = tasks.filter((t) => t.completed).length;
            const summary = `Resumen de tareas:\n- Pendientes: ${pending}\n- Completadas: ${done}\n- Total: ${tasks.length}`;

            await sendEmail({
                to: user.email,
                subject: "Resumen de tareas - MateCode",
                body: summary,
            });
            setEmailStatus("sent");
            toast(`Resumen enviado a ${user.email}`);
        } catch {
            setEmailStatus("error");
            toast("No se pudo enviar, intentá de nuevo", "error");
        }
    };

    if (loading) {
        return <p className="text-slate-500 dark:text-slate-400">Cargando tareas...</p>;
    }

    if (error) {
        return <div className={errorClass}>{error}</div>;
    }

    // Filtro de vista, no toca los datos
    const visibleTasks = tasks.filter((t) => filter === "all" || (filter === "done") === t.completed);
    const pendingCount = tasks.filter((t) => !t.completed).length;
    const doneCount = tasks.length - pendingCount;

    const filters = [
        { key: "all", label: `Todas (${tasks.length})` },
        { key: "pending", label: `Pendientes (${pendingCount})` },
        { key: "done", label: `Completadas (${doneCount})` },
    ] as const;

    return (
        <div>
            <TodoForm onAdd={handleAdd} loading={actionLoading} />

            {tasks.length > 0 && (
                <div className="mb-4 flex gap-2">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => setFilter(f.key)}
                            aria-pressed={filter === f.key}
                            className={`rounded-full px-3 py-1 text-sm font-medium transition ${filter === f.key ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-md shadow-violet-600/20" : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}

            {tasks.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                    <button
                        onClick={handleSendSummary}
                        disabled={emailStatus === "sending"}
                        className="mb-4 flex w-auto items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-2 font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                    >
                        <FiSend size={16} aria-hidden="true" />
                        {emailStatus === "sending" ? "Enviando..." : "Enviar resumen por email"}
                    </button>
                </div>
            )}

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-slate-500 dark:text-slate-400">
                    <FiClipboard size={32} aria-hidden="true" className="opacity-60" />
                    <p>No tenés tareas todavía. ¡Agregá una!</p>
                </div>
            ) : (
                visibleTasks.map((task) => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        loading={actionLoading}
                    />
                ))
            )}
        </div>
    );
}