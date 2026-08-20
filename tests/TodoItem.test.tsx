import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "../src/components/TodoItem";
import type { Task } from "../src/types";

const mockTask: Task = {
    id: "1",
    title: "Test task",
    description: "Test description",
    completed: false,
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("TodoItem", () => {
    it("renderiza el titulo de la tarea", () => {
        render(
            <TodoItem
                task={mockTask}
                onToggle={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
                loading={false}
            />
        );
        expect(screen.getByText("Test task")).toBeInTheDocument();
    });

    it("renderiza la descripcion cuando existe", () => {
        render(
            <TodoItem
                task={mockTask}
                onToggle={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
                loading={false}
            />
        );
        expect(screen.getByText("Test description")).toBeInTheDocument();
    });

    it("checkbox esta marcado cuando la tarea esta completada", () => {
        const completedTask = { ...mockTask, completed: true };
        render(
            <TodoItem
                task={completedTask}
                onToggle={() => {}}
                onUpdate={() => {}}
                onDelete={() => {}}
                loading={false}
            />
        );
        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("llama a onToggle al hacer click en el checkbox", () => {
        const onToggle = vi.fn();
        render(
            <TodoItem
                task={mockTask}
                onToggle={onToggle}
                onUpdate={() => {}}
                onDelete={() => {}}
                loading={false}
            />
        );
        fireEvent.click(screen.getByRole("checkbox"));
        expect(onToggle).toHaveBeenCalledWith("1", false);
    });

    it("llama a onDelete al hacer click en eliminar", () => {
        const onDelete = vi.fn();
        render(
            <TodoItem
                task={mockTask}
                onToggle={() => {}}
                onUpdate={() => {}}
                onDelete={onDelete}
                loading={false}
            />
        );
        fireEvent.click(screen.getByText("Eliminar"));
        expect(onDelete).toHaveBeenCalledWith("1");
    });
});