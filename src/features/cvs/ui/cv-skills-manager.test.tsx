import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LevelGroup } from "@/shared/helpers";

import { CvSkillsManager } from "./cv-skills-manager";

const {
  addCvSkillAction,
  updateCvSkillAction,
  removeCvSkillsAction,
  refresh,
  toastAdd,
} = vi.hoisted(() => ({
  addCvSkillAction: vi.fn(),
  updateCvSkillAction: vi.fn(),
  removeCvSkillsAction: vi.fn(),
  refresh: vi.fn(),
  toastAdd: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../api/cv-skills.actions", () => ({
  addCvSkillAction,
  updateCvSkillAction,
  removeCvSkillsAction,
}));

vi.mock("@/shared/ui/toast", () => ({ toast: { add: toastAdd } }));

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

const groups: LevelGroup[] = [
  {
    id: "frontend",
    name: "Frontend",
    items: [
      { name: "React", level: 5, levelLabel: "Expert" },
      { name: "CSS", level: 3, levelLabel: "Competent" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    items: [{ name: "NestJS", level: 4, levelLabel: "Proficient" }],
  },
];

const options = [
  { value: "React", label: "React" },
  { value: "CSS", label: "CSS" },
  { value: "NestJS", label: "NestJS" },
  { value: "Node", label: "Node" },
];

function renderManager(
  overrides: Partial<React.ComponentProps<typeof CvSkillsManager>> = {},
) {
  return render(
    <CvSkillsManager cvId="cv-1" groups={groups} options={options} {...overrides} />,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CvSkillsManager", () => {
  it("renders skills grouped by category", () => {
    renderManager();

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("NestJS")).toBeInTheDocument();
    expect(screen.getByText("Expert")).toBeInTheDocument();
    expect(screen.getByText("Proficient")).toBeInTheDocument();
  });

  it("shows the empty state", () => {
    renderManager({ groups: [] });

    expect(screen.getByText("No skills added yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove skills/i })).toBeDisabled();
  });

  it("adds a skill from the owner list and closes the dialog", async () => {
    addCvSkillAction.mockResolvedValue({ success: true });

    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /add skill/i }));

    expect(
      screen.getByRole("heading", { name: "Add skill" }),
    ).toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton).toBeDisabled();

    const optionLabels = screen
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(optionLabels).toContain("Node");
    expect(optionLabels).not.toContain("React");

    fireEvent.change(screen.getByLabelText("Skill"), {
      target: { value: "Node" },
    });

    await waitFor(() => expect(addButton).toBeEnabled());
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addCvSkillAction).toHaveBeenCalledWith("cv-1", "Node");
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(
      screen.queryByRole("heading", { name: "Add skill" }),
    ).toBeNull();
  });

  it("keeps the dialog open and shows the error when adding fails", async () => {
    addCvSkillAction.mockResolvedValue({
      success: false,
      error: "This skill has already been added",
      code: "skillHasBeenAdded",
    });

    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /add skill/i }));
    fireEvent.change(screen.getByLabelText("Skill"), {
      target: { value: "Node" },
    });

    const addButton = screen.getByRole("button", { name: "Add" });
    await waitFor(() => expect(addButton).toBeEnabled());
    fireEvent.click(addButton);

    expect(
      await screen.findByText("This skill has already been added"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Add skill" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Skill")).toHaveValue("Node");
    expect(refresh).not.toHaveBeenCalled();
    expect(toastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
  });

  it("updates the selected skill from the skill dialog", async () => {
    updateCvSkillAction.mockResolvedValue({ success: true });

    renderManager();

    fireEvent.click(screen.getByRole("button", { name: "Update React" }));

    expect(
      screen.getByRole("heading", { name: "Update skill" }),
    ).toBeInTheDocument();

    const skillSelect = screen.getByLabelText("Skill");
    expect(skillSelect).toHaveValue("React");

    const optionLabels = screen
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(optionLabels).toContain("Node");
    expect(optionLabels).not.toContain("CSS");

    fireEvent.change(skillSelect, { target: { value: "Node" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateCvSkillAction).toHaveBeenCalledWith("cv-1", "React", "Node");
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(
      screen.queryByRole("heading", { name: "Update skill" }),
    ).toBeNull();
  });

  it("selects several skills and removes them after confirmation", async () => {
    removeCvSkillsAction.mockResolvedValue({ success: true });

    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /remove skills/i }));

    const removeButton = screen.getByRole("button", { name: /remove \(0\)/i });
    expect(removeButton).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox", { name: "Select React" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select CSS" }));

    expect(
      screen.getByRole("button", { name: /remove \(2\)/i }),
    ).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /remove \(2\)/i }));

    expect(
      screen.getByText("Are you sure you want to remove 2 skills?"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(removeCvSkillsAction).toHaveBeenCalledWith("cv-1", [
        "React",
        "CSS",
      ]);
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(
      screen.queryByRole("button", { name: /remove \(\d\)/i }),
    ).toBeNull();
    expect(
      screen.getByRole("button", { name: /add skill/i }),
    ).toBeInTheDocument();
  });

  it("shows a system error and keeps the selection when removing fails", async () => {
    removeCvSkillsAction.mockResolvedValue({
      success: false,
      error: "Something went wrong",
      code: null,
    });

    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /remove skills/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select React" }));
    fireEvent.click(screen.getByRole("button", { name: /remove \(1\)/i }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => expect(toastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    ));
    expect(refresh).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /remove \(1\)/i }),
    ).toBeInTheDocument();
  });
});
