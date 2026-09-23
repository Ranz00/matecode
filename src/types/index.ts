// Interfaces compartidas en toda la app

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Valores del formulario de tareas, un solo objeto
export interface TaskFormValues {
    title: string;
    description: string;
}