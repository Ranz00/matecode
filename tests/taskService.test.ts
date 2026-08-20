import { describe, it, expect } from "vitest";
import { createTask, updateTask, deleteTask, toggleTaskCompleted, subscribeToTasks } from "../src/services/taskService";

describe("taskService", () => {
    it("createTask es una funcion", () => {
        expect(typeof createTask).toBe("function");
    });

    it("updateTask es una funcion", () => {
        expect(typeof updateTask).toBe("function");
    });

    it("deleteTask es una funcion", () => {
        expect(typeof deleteTask).toBe("function");
    });

    it("toggleTaskCompleted es una funcion", () => {
        expect(typeof toggleTaskCompleted).toBe("function");
    });

    it("subscribeToTasks es una funcion", () => {
        expect(typeof subscribeToTasks).toBe("function");
    });
});