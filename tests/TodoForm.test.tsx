import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoForm } from "../src/components/TodoForm";

describe("TodoForm", () => {
    it("renderiza el formulario correctamente", () => {
        render(<TodoForm onAdd={() => {}} loading={false} />);
        expect(screen.getByPlaceholderText("¿Qué tenés que hacer?")).toBeInTheDocument();
        expect(screen.getByText("Agregar tarea")).toBeInTheDocument();
    });
});