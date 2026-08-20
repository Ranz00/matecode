// Interfaces compartidas en toda la app

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}