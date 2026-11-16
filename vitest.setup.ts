import "@testing-library/jest-dom/vitest";

// `server-only` is a marker package: Next.js swaps it for an empty module on
// the server, but Vitest resolves the default entry that throws. Mock it so
// server-only modules can be imported in unit tests.
import { vi } from "vitest";

vi.mock("server-only", () => ({}));
