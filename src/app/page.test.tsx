import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the greeting", () => {
    render(<Home />);

    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });
});
