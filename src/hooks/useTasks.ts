// Hook que expone las tareas del usuario con sincronización en tiempo real
// Cancela la suscripción al desmontar (evita memory leak)

import { useState, useEffect } from "react";
import { subscribeToTasks } from "../services/taskService";
import type { Task } from "../types";

export function useTasks(userId: string | undefined) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsubscribe = subscribeToTasks(
            userId,
            (updatedTasks) => {
                setTasks(updatedTasks);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        // Cleanup: cancelar suscripción al desmontar
        return () => unsubscribe();
    }, [userId]);

    return { tasks, loading, error };
}