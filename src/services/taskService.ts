// Servicio de tareas con CRUD completo
// Toda la lógica de Firestore vive aquí, los componentes no tocan Firestore directamente

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    type DocumentData,
    type QuerySnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task } from "../types";

// Crear tarea (el userId viene de auth, nunca del formulario)
export const createTask = async (
    title: string,
    description: string,
    userId: string
) => {
    return addDoc(collection(db, "tasks"), {
        title,
        description,
        completed: false,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

// Actualizar tarea (solo campos permitidos)
export const updateTask = async (
    taskId: string,
    updates: Partial<Pick<Task, "title" | "description" | "completed">>
) => {
    const taskRef = doc(db, "tasks", taskId);
    return updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
};

// Eliminar tarea
export const deleteTask = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    return deleteDoc(taskRef);
};

// Toggle completada
export const toggleTaskCompleted = async (taskId: string, completed: boolean) => {
    return updateTask(taskId, { completed: !completed });
};

// Mapper: convierte Timestamp de Firestore a Date para los componentes
// Maneja el caso donde createdAt puede ser null en pending writes
const mapTask = (docSnap: DocumentData): Task => {
    const data = docSnap.data();
    return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        userId: data.userId,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    };
};

// Suscripción en tiempo real a las tareas del usuario
// Se cancela automáticamente cuando el componente se desmonta
export const subscribeToTasks = (
    userId: string,
    callback: (tasks: Task[]) => void,
    onError?: (error: Error) => void
) => {
    const q = query(
        collection(db, "tasks"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
            const tasks = snapshot.docs.map(mapTask);
            callback(tasks);
        },
        onError
    );
};