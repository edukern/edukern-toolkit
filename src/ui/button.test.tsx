import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renderiza o texto e é um <button>", () => {
    render(<Button>Salvar</Button>);
    const btn = screen.getByRole("button", { name: "Salvar" });
    expect(btn.tagName).toBe("BUTTON");
  });

  it("aplica a variante primária por padrão e a secundária quando pedida", () => {
    const { rerender } = render(<Button>Ok</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-accent");
    rerender(<Button variant="secondary">Ok</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-surface");
  });

  it("repassa disabled", () => {
    render(<Button disabled>Ok</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
