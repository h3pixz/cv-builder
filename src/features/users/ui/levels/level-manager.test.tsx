import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LevelManager } from "./level-manager";
import type { LevelGroup } from "../../model/levels";

const {
  addSkillAction,
  addLanguageAction,
  updateSkillAction,
  updateLanguageAction,
  deleteSkillsAction,
  deleteLanguagesAction,
  refresh,
} = vi.hoisted(() => ({
  addSkillAction: vi.fn(),
  addLanguageAction: vi.fn(),
  updateSkillAction: vi.fn(),
  updateLanguageAction: vi.fn(),
  deleteSkillsAction: vi.fn(),
  deleteLanguagesAction: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../../api/profile-levels.actions", () => ({
  addSkillAction,
  addLanguageAction,
  updateSkillAction,
  updateLanguageAction,
  deleteSkillsAction,
  deleteLanguagesAction,
}));

vi.mock("@/shared/ui/toast", () => ({ toast: { add: vi.fn() } }));

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

const skillGroups: LevelGroup[] = [
  {
    id: "frontend",
    name: "Frontend",
    items: [
      { name: "React", level: 5, levelLabel: "Expert" },
      { name: "CSS", level: 3, levelLabel: "Competent" },
    ],
  },
];

const skillOptions = [
  { value: "React", label: "React", categoryId: "frontend" },
  { value: "CSS", label: "CSS", categoryId: "frontend" },
  { value: "Node", label: "Node", categoryId: "backend" },
];

const skillLevelOptions = [
  { value: "Novice", label: "Novice" },
  { value: "Advanced", label: "Advanced" },
  { value: "Competent", label: "Competent" },
  { value: "Proficient", label: "Proficient" },
  { value: "Expert", label: "Expert" },
];

const skillMessages = {
  nameRequired: "Skill is required",
  levelRequired: "Skill mastery is required",
};

const languageLevelOptions = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
  { value: "Native", label: "Native" },
];

const languageMessages = {
  nameRequired: "Language is required",
  levelRequired: "Language proficiency is required",
};

function renderSkills(
  overrides: Partial<React.ComponentProps<typeof LevelManager>> = {},
) {
  return render(
    <LevelManager
      kind="skill"
      userId="user-1"
      heading="Current skills"
      groups={skillGroups}
      options={skillOptions}
      levelOptions={skillLevelOptions}
      formMessages={skillMessages}
      canManage
      {...overrides}
    />,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LevelManager", () => {
  it("renders grouped, read-only skills without management actions", () => {
    renderSkills({ canManage: false });

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Expert")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add skill/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /remove skills/i })).toBeNull();

    fireEvent.click(screen.getByText("React"));
    expect(screen.queryByRole("heading", { name: "Update skill" })).toBeNull();
  });

  it("shows the empty state", () => {
    renderSkills({ groups: [] });

    expect(screen.getByText("No skills added yet")).toBeInTheDocument();
  });

  it("adds a skill and closes the dialog", async () => {
    addSkillAction.mockResolvedValue({ success: true });

    renderSkills();

    fireEvent.click(screen.getByRole("button", { name: /add skill/i }));
    expect(
      screen.getByRole("heading", { name: "Add skill" }),
    ).toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Skill"), {
      target: { value: "Node" },
    });
    fireEvent.change(screen.getByLabelText("Skill Mastery"), {
      target: { value: "Advanced" },
    });

    await waitFor(() => expect(addButton).toBeEnabled());
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addSkillAction).toHaveBeenCalledWith("user-1", {
        name: "Node",
        mastery: "Advanced",
        categoryId: "backend",
      });
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(
      screen.queryByRole("heading", { name: "Add skill" }),
    ).toBeNull();
  });

  it("does not offer already assigned skills", () => {
    renderSkills();

    fireEvent.click(screen.getByRole("button", { name: /add skill/i }));

    const options = screen
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(options).toContain("Node");
    expect(options).not.toContain("React");
    expect(options).not.toContain("CSS");
  });

  it("keeps the dialog open and shows the error when adding fails", async () => {
    addSkillAction.mockResolvedValue({
      success: false,
      error: "This skill has already been added",
      code: "skillHasBeenAdded",
    });

    renderSkills();

    fireEvent.click(screen.getByRole("button", { name: /add skill/i }));
    fireEvent.change(screen.getByLabelText("Skill"), {
      target: { value: "Node" },
    });
    fireEvent.change(screen.getByLabelText("Skill Mastery"), {
      target: { value: "Expert" },
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
    expect(refresh).not.toHaveBeenCalled();
  });

  it("updates mastery from the skill dialog", async () => {
    updateSkillAction.mockResolvedValue({ success: true });

    renderSkills();

    fireEvent.click(screen.getByRole("button", { name: "Update React" }));

    expect(
      screen.getByRole("heading", { name: "Update skill" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Skill")).toBeDisabled();
    expect(screen.getByLabelText("Skill Mastery")).toHaveValue("Expert");

    fireEvent.change(screen.getByLabelText("Skill Mastery"), {
      target: { value: "Proficient" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateSkillAction).toHaveBeenCalledWith("user-1", {
        name: "React",
        mastery: "Proficient",
      });
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });

  it("selects several skills and removes them after confirmation", async () => {
    deleteSkillsAction.mockResolvedValue({ success: true });

    renderSkills();

    fireEvent.click(screen.getByRole("button", { name: /remove skills/i }));

    const removeButton = screen.getByRole("button", { name: /remove \(0\)/i });
    expect(removeButton).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Select React" }));
    fireEvent.click(screen.getByRole("button", { name: "Select CSS" }));

    expect(
      screen.getByRole("button", { name: /remove \(2\)/i }),
    ).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: /remove \(2\)/i }));

    expect(
      screen.getByText("Are you sure you want to remove 2 skills?"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(deleteSkillsAction).toHaveBeenCalledWith("user-1", [
        "React",
        "CSS",
      ]);
    });
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(
      screen.queryByRole("button", { name: /remove \(\d\)/i }),
    ).toBeNull();
    expect(screen.getByRole("button", { name: /add skill/i })).toBeInTheDocument();
  });

  it("uses language labels and messages", async () => {
    addLanguageAction.mockResolvedValue({ success: true });

    render(
      <LevelManager
        kind="language"
        userId="user-1"
        heading="Current Languages"
        groups={[
          {
            id: "languages",
            name: "Current Languages",
            items: [{ name: "English", level: 7, levelLabel: "Native" }],
          },
        ]}
        options={[
          { value: "English", label: "English" },
          { value: "German", label: "German" },
        ]}
        levelOptions={languageLevelOptions}
        formMessages={languageMessages}
        canManage
        showGroupNames={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /add language/i }));
    expect(
      screen.getByRole("heading", { name: "Add language" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Language"), {
      target: { value: "German" },
    });
    fireEvent.change(screen.getByLabelText("Language Proficiency"), {
      target: { value: "B1" },
    });

    const addButton = screen.getByRole("button", { name: "Add" });
    await waitFor(() => expect(addButton).toBeEnabled());
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addLanguageAction).toHaveBeenCalledWith("user-1", {
        name: "German",
        mastery: "B1",
      });
    });
  });

  it("shows the language empty state", () => {
    render(
      <LevelManager
        kind="language"
        userId="user-1"
        heading="Current Languages"
        groups={[]}
        options={[]}
        levelOptions={languageLevelOptions}
        formMessages={languageMessages}
        canManage={false}
      />,
    );

    expect(screen.getByText("No languages added yet")).toBeInTheDocument();
  });
});
