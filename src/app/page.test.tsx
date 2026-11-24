import { describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import Home from "@/app/page";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

describe("Home", () => {
  it("redirects to the users list", () => {
    Home();

    expect(redirect).toHaveBeenCalledWith("/users");
  });
});
