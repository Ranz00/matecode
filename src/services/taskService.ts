// Servicio de tareas con CRUD completo
// Toda la lógica de Firestore vive aquí, los componentes no tocan Firestore directamente

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Task, TaskPriority } from '../types'

// Crear tarea (el userId viene de auth, nunca del formulario)
export const createTask = async (
  title: string,
  description: string,
  userId: string,
  values?: { dueDate?: Date | null; priority?: TaskPriority; order?: number },
) => {
  return addDoc(collection(db, 'tasks'), {
    title,
    description,
    completed: false,
    userId,
    // Defaults de docs nuevos (los viejos los cubre el mapper)
    dueDate: values?.dueDate ?? null,
    priority: values?.priority ?? 'media',
    // Negativo para que lo nuevo quede primero (orden ascendente)
    order: values?.order ?? -Date.now(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// Actualizar tarea (solo campos permitidos)
export const updateTask = async (
  taskId: string,
  updates: Partial<
    Pick<Task, 'title' | 'description' | 'completed' | 'dueDate' | 'priority' | 'order'>
  >,
) => {
  const taskRef = doc(db, 'tasks', taskId)
  return updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// Eliminar tarea
export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId)
  return deleteDoc(taskRef)
}

// Guarda el orden manual en un solo batch (una escritura atómica)
export const persistTaskOrder = async (ids: string[]) => {
  const batch = writeBatch(db)
  ids.forEach((taskId, order) => {
    batch.update(doc(db, 'tasks', taskId), {
      order,
      updatedAt: serverTimestamp(),
    })
  })
  return batch.commit()
}

// Toggle completada
export const toggleTaskCompleted = async (
  taskId: string,
  completed: boolean,
) => {
  return updateTask(taskId, { completed: !completed })
}

// Mapper: convierte Timestamp de Firestore a Date para los componentes
// Maneja el caso donde createdAt puede ser null en pending writes
const mapTask = (docSnap: DocumentData): Task => {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    title: data.title,
    description: data.description,
    completed: data.completed,
    userId: data.userId,
    // Docs viejos sin estos campos quedan en null/media/fecha, sin migración
    dueDate: data.dueDate?.toDate?.() ?? null,
    priority: data.priority ?? 'media',
    order:
      typeof data.order === 'number'
        ? data.order
        : (data.createdAt?.toDate?.()?.getTime() ?? 0),
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  }
}

// Suscripción en tiempo real a las tareas del usuario
// Se cancela automáticamente cuando el componente se desmonta
export const subscribeToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const tasks = snapshot.docs.map(mapTask)
      callback(tasks)
    },
    onError,
  )
}
