import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";
import { createTask, toggleTaskCompleted, updateTask, deleteTask } from "../services/taskService";
import { sendEmail } from "../services/emailService";
import { useState } from "react";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";

export function TodoList() {
    const { user } = useAuth();
    const { tasks, loading, error } = useTasks(user?.uid);
    const [actionLoading, setActionLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleAdd = async (title: string, description: string) => {
        if (!user) return;
        setActionLoading(true);
        try {
            await createTask(title, description, user.uid);
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggle = async (taskId: string, completed: boolean) => {
        setActionLoading(true);
        try {
            await toggleTaskCompleted(taskId, completed);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (taskId: string, title: string, description: string) => {
        setActionLoading(true);
        try {
            await updateTask(taskId, { title, description });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (taskId: string) => {
        setActionLoading(true);
        try {
            await deleteTask(taskId);
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
        } catch {
            setEmailStatus("error");
        }
    };

    if (loading) {
        return <p>Cargando tareas...</p>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            <TodoForm onAdd={handleAdd} loading={actionLoading} />

            {tasks.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                    <button
                        onClick={handleSendSummary}
                        disabled={emailStatus === "sending"}
                        className="btn btn-primary"
                        style={{ width: "auto", marginBottom: "16px" }}
                    >
                        {emailStatus === "sending" ? "Enviando..." : "Enviar resumen por email"}
                    </button>
                    {emailStatus === "sent" && <p style={{ color: "#16a34a", fontSize: "14px" }}>Email enviado correctamente</p>}
                    {emailStatus === "error" && <p style={{ color: "#dc2626", fontSize: "14px" }}>Error al enviar email</p>}
                </div>
            )}

            {tasks.length === 0 ? (
                <p style={{ textAlign: "center", color: "#6b7280" }}>
                    No tenés tareas todavía. ¡Agregá una!
                </p>
            ) : (
                tasks.map((task) => (
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