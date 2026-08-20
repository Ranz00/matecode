import { describe, it, expect } from "vitest";
import { traducirError } from "../src/utils/errors";

describe("traducirError", () => {
    it("retorna mensaje para user-not-found", () => {
        expect(traducirError("auth/user-not-found")).toBe("No existe una cuenta con este email");
    });

    it("retorna mensaje para wrong-password", () => {
        expect(traducirError("auth/wrong-password")).toBe("Contraseña incorrecta");
    });

    it("retorna mensaje genérico para error desconocido", () => {
        expect(traducirError("auth/unknown-error")).toBe("Error. Intentá de nuevo.");
    });
});