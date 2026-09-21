import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardBody } from "./card";

describe("Card", () => {
  it("compõe header, título e corpo", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Grupo A</CardTitle>
        </CardHeader>
        <CardBody>conteúdo</CardBody>
      </Card>,
    );
    expect(screen.getByText("Grupo A")).toBeInTheDocument();
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });
});
