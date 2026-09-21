import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("renderiza um campo de texto e repassa value", () => {
    render(<Input defaultValue="abc" aria-label="nome" />);
    expect(screen.getByLabelText("nome")).toHaveValue("abc");
  });

  it("reflete aria-invalid no elemento (com e sem)", () => {
    const { rerender } = render(<Input aria-label="x" />);
    expect(screen.getByLabelText("x")).not.toHaveAttribute("aria-invalid");
    rerender(<Input aria-label="x" aria-invalid />);
    expect(screen.getByLabelText("x")).toHaveAttribute("aria-invalid", "true");
  });
});
