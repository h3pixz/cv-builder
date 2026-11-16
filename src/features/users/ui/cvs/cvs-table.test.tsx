import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CvsTable } from "./cvs-table";

const cvs = [
  {
    id: "cv-1",
    name: "Frontend CV",
    education: "BSUIR",
    description: "Built the design system.",
  },
];

describe("CvsTable", () => {
  it("shows an empty state when there are no CVs", () => {
    render(<CvsTable cvs={[]} employee="user@example.com" />);

    expect(screen.getByText("No CVs found.")).toBeInTheDocument();
  });

  it("renders the CV details and the employee", () => {
    render(<CvsTable cvs={cvs} employee="user@example.com" />);

    expect(screen.getByText("Frontend CV")).toBeInTheDocument();
    expect(screen.getByText("BSUIR")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("Built the design system.")).toBeInTheDocument();
  });

  it("renders an actions menu for each CV", () => {
    render(<CvsTable cvs={cvs} employee="user@example.com" />);

    expect(
      screen.getByRole("button", { name: "Actions for CV cv-1" }),
    ).toBeInTheDocument();
  });

  it("renders an empty education cell when education is missing", () => {
    render(
      <CvsTable
        cvs={[{ id: "cv-2", name: "Empty CV", description: "No education" }]}
        employee="user@example.com"
      />,
    );

    expect(screen.getByText("Empty CV")).toBeInTheDocument();
    expect(screen.getByText("No education")).toBeInTheDocument();
  });
});
