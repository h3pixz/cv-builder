import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SkillsManager, type SkillGroupView } from "./skills-manager";

const {
  addMySkillAction,
  updateMySkillAction,
  deleteMySkillsAction,
  refresh,
} = vi.hoisted(() => ({
  addMySkillAction: vi.fn(),
  updateMySkillAction: vi.fn(),
  deleteMySkillsAction: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../api/profile-skills.actions", () => ({
  addMySkillAction,
  updateMySkillAction,
  deleteMySkillsAction,
}));

vi.mock("@/shared/ui/toast", () => ({ toast: { add: vi.fn() } }));

vi.mock("@/shared/ui/combobox", () => ({
  Combobox: ({
    items,
    value,
    onValueChange,
    disabled,
  }: {
    items: { value: string; label: string }[];
    value?: { value: string; label: string } | null;
    onValueChange?: (value: { value: string; label: string } | null) => void;
    disabled?: boolean;
  }) => (
    <select
      aria-label="Skill"
      value={value?.value ?? ""}
      disabled={disabled}
      onChange={(event) =>
        onValueChange?.(
          items.find((item) => item.value === event.target.value) ?? null,
        )
      }
    >
      <option value="">Skill</option>
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  ),
  ComboboxInput: () => null,
  ComboboxContent: () => null,
  ComboboxEmpty: () => null,
  ComboboxList: () => null,
  ComboboxItem: () => null,
}));

vi.mock("@/shared/ui/select", () => ({
  SelectField: function MockSelectField({
    options,
    value,
    onValueChange,
    disabled,
    error,
    id,
    placeholder,
  }: {
    options: { value: string; label: string }[];
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    disabled?: boolean;
    error?: string;
    id?: string;
    placeholder?: string;
  }) {
    return (
      <div>
        <select
          id={id}
          aria-label={placeholder}
          value={value ?? ""}
          disabled={disabled}
          onChange={(event) => onValueChange?.(event.target.value || null)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p role="alert">{error}</p>}
      </div>
    );
  },
}));

vi.mock("@/shared/ui/dialog", () => {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    return <div>{children}</div>;
  }

  return {
    Dialog: ({
      open,
      children,
    }: {
      open: boolean;
      children?: React.ReactNode;
    }) => (open ? <div>{children}</div> : null),
    DialogContent: Wrapper,
    DialogHeader: Wrapper,
    DialogFooter: Wrapper,
    DialogTitle: ({ children }: { children?: React.ReactNode }) => (
      <h2>{children}</h2>
    ),
    DialogDescription: ({ children }: { children?: React.ReactNode }) => (
      <p>{children}</p>
    ),
  };
});

const groups: SkillGroupView[] = [
  {
    id: "frontend",
    name: "Frontend",
    items: [
      { name: "React", level: 5, levelLabel: "Expert" },
      { name: "CSS", level: 3, levelLabel: "Competent" },
    ],
  },
];

const options = [
  { value: "React", label: "React", categoryId: "frontend" },
  { value: "CSS", label: "CSS", categoryId: "frontend" },
  { value: "Node", label: "Node", categoryId: "backend" },
];

function renderManager(overrides: Partial<Parameters<typeof SkillsManager>[0]> = {}) {
  return render(
    <SkillsManager groups={groups} options={options} {...overrides} />,
  );
}

beforeEach(() => {
  addMySkillAction.mockReset();
  updateMySkillAction.mockReset();
  deleteMySkillsAction.mockReset();
  refresh.mockReset();

  addMySkillAction.mockResolvedValue({ success: true });
  updateMySkillAction.mockResolvedValue({ success: true });
  deleteMySkillsAction.mockResolvedValue({ success: true });
});

describe("SkillsManager", () => {
  it("renders skills grouped by category with their mastery", () => {
    renderManager();

    expect(screen.getByRole("heading", { name: "Current skills" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Frontend" })).toBeTruthy();
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("Expert")).toBeTruthy();
    expect(screen.getByText("Competent")).toBeTruthy();
  });

  it("shows an empty state", () => {
    renderManager({ groups: [] });

    expect(screen.getByText("No skills added yet")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Remove skills/ }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("hides the actions for users who cannot manage the profile", () => {
    renderManager({ canManage: false });

    expect(screen.queryByRole("button", { name: /Add skill/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Remove skills/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Update React" })).toBeNull();
  });

  it("only offers catalog skills the user does not have yet", () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /Add skill/ }));

    const select = screen.getByLabelText("Skill") as HTMLSelectElement;
    const values = Array.from(select.options).map((option) => option.value);

    expect(values).toContain("Node");
    expect(values).not.toContain("React");
  });

  it("adds a skill with its mastery and category", async () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /Add skill/ }));

    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton.hasAttribute("disabled")).toBe(true);

    fireEvent.change(screen.getByLabelText("Skill"), {
      target: { value: "Node" },
    });
    fireEvent.change(screen.getByLabelText("Skill Mastery"), {
      target: { value: "Advanced" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(addMySkillAction).toHaveBeenCalledWith({
        name: "Node",
        mastery: "Advanced",
        categoryId: "backend",
      });
    });
    expect(refresh).toHaveBeenCalled();
  });

  it("shows a duplicate error inline", async () => {
    addMySkillAction.mockResolvedValue({
      success: false,
      error: "Skill already exists",
      code: null,
      field: "name",
    });
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /Add skill/ }));
    fireEvent.change(screen.getByLabelText("Skill"), {
      target: { value: "Node" },
    });
    fireEvent.change(screen.getByLabelText("Skill Mastery"), {
      target: { value: "Advanced" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(screen.getAllByText("Skill already exists").length).toBeGreaterThan(
        0,
      );
    });
  });

  it("updates the mastery without changing the skill", async () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: "Update React" }));

    expect(screen.getByRole("heading", { name: "Update skill" })).toBeTruthy();

    const nameSelect = screen.getByLabelText("Skill") as HTMLSelectElement;
    expect(nameSelect.disabled).toBe(true);
    expect((screen.getByLabelText("Skill Mastery") as HTMLSelectElement).value).toBe(
      "Expert",
    );

    fireEvent.change(screen.getByLabelText("Skill Mastery"), {
      target: { value: "Proficient" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(updateMySkillAction).toHaveBeenCalledWith({
        name: "React",
        mastery: "Proficient",
      });
    });
  });

  it("removes several selected skills after confirmation", async () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /Remove skills/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select React" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select CSS" }));

    fireEvent.click(screen.getByRole("button", { name: /Delete \(2\)/ }));

    expect(
      screen.getByText("Are you sure you want to remove 2 skills?"),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(deleteMySkillsAction).toHaveBeenCalledWith(["React", "CSS"]);
    });
    expect(refresh).toHaveBeenCalled();
  });
});
