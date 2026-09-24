import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoList } from "../src/components/TodoList";
import { ToastProvider } from "../src/components/Toast";
import { toggleTaskCompleted } from "../src/services/taskService";

const mockUseAuth = vi.fn();
const mockUseTasks = vi.fn();

vi.mock("../src/hooks/useAuth", () => ({
    useAuth: () => mockUseAuth(),
}));

vi.mock("../src/hooks/useTasks", () => ({
    useTasks: () => mockUseTasks(),
}));

vi.mock("../src/services/emailService", () => ({
    sendEmail: vi.fn(),
}));

vi.mock("../src/services/taskService", () => ({
    createTask: vi.fn(),
    toggleTaskCompleted: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
}));

describe("TodoList", () => {
    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            user: { uid: "user1", email: "test@test.com", displayName: null },
            loading: false,
        });
        mockUseTasks.mockReturnValue({
            tasks: [],
            loading: false,
            error: null,
        });
    });

    it("muestra mensaje cuando no hay tareas", () => {
        render(<ToastProvider><TodoList /></ToastProvider>);
        expect(screen.getByText("No tenés tareas todavía. ¡Agregá una!")).toBeInTheDocument();
    });

    it("muestra formulario de carga", () => {
        render(<ToastProvider><TodoList /></ToastProvider>);
        expect(screen.getByPlaceholderText("¿Qué tenés que hacer?")).toBeInTheDocument();
    });

    it("muestra boton de enviar email cuando hay tareas", () => {
        mockUseTasks.mockReturnValue({
            tasks: [
                { id: "1", title: "Tarea 1", description: "Desc 1", completed: false, userId: "user1", createdAt: new Date(), updatedAt: new Date() },
            ],
            loading: false,
            error: null,
        });
        render(<ToastProvider><TodoList /></ToastProvider>);
        expect(screen.getByText("Enviar resumen por email")).toBeInTheDocument();
    });

    it("renderiza las tareas cuando existen", () => {
        mockUseTasks.mockReturnValue({
            tasks: [
                { id: "1", title: "Tarea 1", description: "Desc 1", completed: false, userId: "user1", createdAt: new Date(), updatedAt: new Date() },
                { id: "2", title: "Tarea 2", description: "Desc 2", completed: true, userId: "user1", createdAt: new Date(), updatedAt: new Date() },
            ],
            loading: false,
            error: null,
        });
        render(<ToastProvider><TodoList /></ToastProvider>);
        expect(screen.getByText("Tarea 1")).toBeInTheDocument();
        expect(screen.getByText("Tarea 2")).toBeInTheDocument();
    });

    it("filtra pendientes y completadas", () => {
        mockUseTasks.mockReturnValue({
            tasks: [
                { id: "1", title: "Tarea 1", description: "Desc 1", completed: false, userId: "user1", createdAt: new Date(), updatedAt: new Date() },
                { id: "2", title: "Tarea 2", description: "Desc 2", completed: true, userId: "user1", createdAt: new Date(), updatedAt: new Date() },
            ],
            loading: false,
            error: null,
        });
        render(<ToastProvider><TodoList /></ToastProvider>);

        fireEvent.click(screen.getByRole("button", { name: /Pendientes/ }));
        expect(screen.getByText("Tarea 1")).toBeInTheDocument();
        expect(screen.queryByText("Tarea 2")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /Completadas/ }));
        expect(screen.queryByText("Tarea 1")).not.toBeInTheDocument();
        expect(screen.getByText("Tarea 2")).toBeInTheDocument();
    });

    it("muestra error si el toggle falla", async () => {
        mockUseTasks.mockReturnValue({
            tasks: [
                { id: "1", title: "Tarea 1", description: "Desc 1", completed: false, userId: "user1", createdAt: new Date(), updatedAt: new Date() },
            ],
            loading: false,
            error: null,
        });
        vi.mocked(toggleTaskCompleted).mockRejectedValueOnce(new Error("red caída"));
        render(<ToastProvider><TodoList /></ToastProvider>);

        fireEvent.click(screen.getByRole("checkbox"));
        expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo guardar, intentá de nuevo");
    });
});