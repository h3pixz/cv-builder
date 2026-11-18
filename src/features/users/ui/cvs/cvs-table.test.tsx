import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: () => "/users/user-1/cvs",
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(),
}));

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
    render(<CvsTable userId="user-1" cvs={[]} employee="user@example.com" />);

    expect(screen.getByText("No CVs found")).toBeInTheDocument();
  });

  it("renders the CV columns and values", () => {
    render(
      <CvsTable userId="user-1" cvs={cvs} employee="user@example.com" />,
    );

    expect(
      screen.getByRole("columnheader", { name: /name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Education" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Employee" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Frontend CV")).toBeInTheDocument();
    expect(screen.getByText("BSUIR")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  it("renders an actions menu for each CV", () => {
    render(
      <CvsTable userId="user-1" cvs={cvs} employee="user@example.com" />,
    );

    expect(
      screen.getByRole("button", { name: "Actions for CV Frontend CV" }),
    ).toBeInTheDocument();
  });

  it("renders an empty education cell when education is missing", () => {
    render(
      <CvsTable
        userId="user-1"
        cvs={[{ id: "cv-2", name: "Empty CV", description: "No education" }]}
        employee="user@example.com"
      />,
    );

    expect(screen.getByText("Empty CV")).toBeInTheDocument();
    expect(screen.queryByText("No education")).not.toBeInTheDocument();
  });

  it("shows the current sort direction and toggles it", () => {
    render(
      <CvsTable
        userId="user-1"
        cvs={cvs}
        employee="user@example.com"
        sortBy="name"
        sortOrder="asc"
      />,
    );

    const header = screen.getByRole("columnheader", { name: /name/i });
    expect(header).toHaveAttribute("aria-sort", "ascending");

    fireEvent.click(screen.getByRole("button", { name: /name/i }));

    expect(replace).toHaveBeenCalledWith(
      "/users/user-1/cvs?sort_by=name&sort_order=desc",
    );
  });
});
