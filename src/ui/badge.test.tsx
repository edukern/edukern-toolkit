import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("usa o tom neutro por padrão", () => {
    render(<Badge>ao vivo</Badge>);
    expect(screen.getByText("ao vivo")).toHaveClass("bg-canvas");
  });
  it("usa o tom accent quando pedido", () => {
    render(<Badge tone="accent">grupo A</Badge>);
    expect(screen.getByText("grupo A")).toHaveClass("bg-accent");
  });
});
