import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "../src/components/TodoList";

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
        render(<TodoList />);
        expect(screen.getByText("No tenés tareas todavía. ¡Agregá una!")).toBeInTheDocument();
    });

    it("muestra formulario de carga", () => {
        render(<TodoList />);
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
        render(<TodoList />);
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
        render(<TodoList />);
        expect(screen.getByText("Tarea 1")).toBeInTheDocument();
        expect(screen.getByText("Tarea 2")).toBeInTheDocument();
    });
});