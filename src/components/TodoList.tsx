// Lista de tareas que consume useTasks

import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/useAuth";
import { createTask, toggleTaskCompleted, updateTask, deleteTask } from "../services/taskService";
import { useState } from "react";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";

export function TodoList() {
    const { user } = useAuth();
    const { tasks, loading, error } = useTasks(user?.uid);
    const [actionLoading, setActionLoading] = useState(false);

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

    if (loading) {
        return <p>Cargando tareas...</p>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            <TodoForm onAdd={handleAdd} loading={actionLoading} />
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