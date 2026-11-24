import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguagesManager } from "./languages-manager";

const {
  addLanguageAction,
  updateLanguageAction,
  deleteLanguagesAction,
  refresh,
} = vi.hoisted(() => ({
  addLanguageAction: vi.fn(),
  updateLanguageAction: vi.fn(),
  deleteLanguagesAction: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../api/profile-languages.actions", () => ({
  addLanguageAction,
  updateLanguageAction,
  deleteLanguagesAction,
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
      aria-label="Language"
      value={value?.value ?? ""}
      disabled={disabled}
      onChange={(event) =>
        onValueChange?.(
          items.find((item) => item.value === event.target.value) ?? null,
        )
      }
    >
      <option value="">Language</option>
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

const items = [
  { name: "English", level: 4, levelLabel: "B2" },
  { name: "German", level: 7, levelLabel: "Native" },
];

const options = [
  { value: "English", label: "English" },
  { value: "German", label: "German" },
  { value: "French", label: "French" },
];

function renderManager(overrides: Partial<Parameters<typeof LanguagesManager>[0]> = {}) {
  return render(
    <LanguagesManager
      userId="user-1"
      items={items}
      options={options}
      {...overrides}
    />,
  );
}

beforeEach(() => {
  addLanguageAction.mockReset();
  updateLanguageAction.mockReset();
  deleteLanguagesAction.mockReset();
  refresh.mockReset();

  addLanguageAction.mockResolvedValue({ success: true });
  updateLanguageAction.mockResolvedValue({ success: true });
  deleteLanguagesAction.mockResolvedValue({ success: true });
});

describe("LanguagesManager", () => {
  it("renders the current languages with their proficiency", () => {
    renderManager();

    expect(
      screen.getByRole("heading", { name: "Current Languages" }),
    ).toBeTruthy();
    expect(screen.getByText("English")).toBeTruthy();
    expect(screen.getByText("B2")).toBeTruthy();
    expect(screen.getByText("German")).toBeTruthy();
    expect(screen.getByText("Native")).toBeTruthy();
  });

  it("shows an empty state", () => {
    renderManager({ items: [] });

    expect(screen.getByText("No languages added yet")).toBeTruthy();
    expect(
      screen
        .getByRole("button", { name: /Remove languages/ })
        .hasAttribute("disabled"),
    ).toBe(true);
  });

  it("only offers catalog languages the user does not have yet", () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /Add language/ }));

    const select = screen.getByLabelText("Language") as HTMLSelectElement;
    const values = Array.from(select.options).map((option) => option.value);

    expect(values).toContain("French");
    expect(values).not.toContain("English");
    expect(values).not.toContain("German");
  });

  it("adds a language with its proficiency", async () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /Add language/ }));

    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton.hasAttribute("disabled")).toBe(true);

    fireEvent.change(screen.getByLabelText("Language"), {
      target: { value: "French" },
    });
    fireEvent.change(screen.getByLabelText("Language Proficiency"), {
      target: { value: "B1" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(addLanguageAction).toHaveBeenCalledWith("user-1", {
        name: "French",
        mastery: "B1",
      });
    });
    expect(refresh).toHaveBeenCalled();
  });

  it("shows a duplicate error inline", async () => {
    addLanguageAction.mockResolvedValue({
      success: false,
      error: "Language already exists",
      code: "languageHasBeenAdded",
      field: "name",
    });
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /Add language/ }));
    fireEvent.change(screen.getByLabelText("Language"), {
      target: { value: "French" },
    });
    fireEvent.change(screen.getByLabelText("Language Proficiency"), {
      target: { value: "B1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(
        screen.getAllByText("Language already exists").length,
      ).toBeGreaterThan(0);
    });
  });

  it("updates the proficiency without changing the language", async () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: "Update English" }));

    expect(screen.getByRole("heading", { name: "Edit language" })).toBeTruthy();

    const nameInput = screen.getByLabelText("Language") as HTMLInputElement;
    expect(nameInput.disabled).toBe(true);
    expect(nameInput.value).toBe("English");
    expect(
      (screen.getByLabelText("Language Proficiency") as HTMLSelectElement).value,
    ).toBe("B2");

    fireEvent.change(screen.getByLabelText("Language Proficiency"), {
      target: { value: "C1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateLanguageAction).toHaveBeenCalledWith("user-1", {
        name: "English",
        mastery: "C1",
      });
    });
  });

  it("hides management actions when the profile is read-only", () => {
    renderManager({ canManage: false });

    expect(
      screen.queryByRole("button", { name: /Add language/ }),
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: /Remove languages/ }),
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Update English" }),
    ).toBeNull();
  });

  it("removes several selected languages after confirmation", async () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /Remove languages/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select English" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select German" }));

    fireEvent.click(screen.getByRole("button", { name: /Remove \(2\)/ }));

    expect(
      screen.getByText("Are you sure you want to remove 2 languages?"),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(deleteLanguagesAction).toHaveBeenCalledWith("user-1", [
        "English",
        "German",
      ]);
    });
    expect(refresh).toHaveBeenCalled();
  });
});
