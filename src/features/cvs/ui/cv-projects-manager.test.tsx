import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  CvProjectOption,
  CvProjectRecord,
} from "../model/cv-project-record";
import { CvProjectsManager } from "./cv-projects-manager";

const {
  addCvProjectAction,
  updateCvProjectAction,
  removeCvProjectAction,
  refresh,
  toastAdd,
} = vi.hoisted(() => ({
  addCvProjectAction: vi.fn(),
  updateCvProjectAction: vi.fn(),
  removeCvProjectAction: vi.fn(),
  refresh: vi.fn(),
  toastAdd: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../api/cv-projects.actions", () => ({
  addCvProjectAction,
  updateCvProjectAction,
  removeCvProjectAction,
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
  MultiselectField: function MockMultiselectField({
    options,
    value = [],
    onValueChange,
    disabled,
    error,
    id,
    placeholder,
  }: {
    options: { value: string; label: string }[];
    value?: string[];
    onValueChange?: (value: string[]) => void;
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
          multiple
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onValueChange?.(
              Array.from(
                event.target.selectedOptions,
                (option) => option.value,
              ),
            )
          }
        >
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

vi.mock("@/shared/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ render }: { render?: React.ReactNode }) => (
    <>{render}</>
  ),
  DropdownMenuContent: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

const projects: CvProjectRecord[] = [
  {
    id: "project-1",
    name: "SaaS Media Platform",
    description: "A digital music, podcast, and video service.",
    domain: "IoT",
    startDate: "2023-08-21",
    endDate: null,
    environment: ["React", "Node.js"],
    roles: ["Frontend Developer"],
    responsibilities: ["Managed to write code in time"],
  },
  {
    id: "project-2",
    name: "Business Process Automation",
    description: "A system for setting up business process automation.",
    domain: "Automation",
    startDate: "2023-01-20",
    endDate: "2023-06-19",
    environment: ["NestJS"],
    roles: ["Backend Developer"],
    responsibilities: ["Did something great", "Did not break production"],
  },
];

const catalog: CvProjectOption[] = [
  {
    id: "project-3",
    name: "Data Warehouse",
    domain: "Analytics",
    description: "Analytics platform.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    environment: ["SQL"],
  },
  ...projects.map((project) => ({
    id: project.id,
    name: project.name,
    domain: project.domain,
    description: project.description,
    startDate: project.startDate,
    endDate: project.endDate,
    environment: project.environment,
  })),
];

const roles = ["Frontend Developer", "Backend Developer"];

function renderManager(
  overrides: Partial<React.ComponentProps<typeof CvProjectsManager>> = {},
) {
  return render(
    <CvProjectsManager
      cvId="cv-1"
      projects={projects}
      catalog={catalog}
      roles={roles}
      {...overrides}
    />,
  );
}

function tableRows() {
  return within(screen.getByRole("table")).getAllByRole("row");
}

function selectRoles(value: string) {
  const select = screen.getByLabelText("Roles") as HTMLSelectElement;

  for (const option of Array.from(select.options)) {
    option.selected = option.value === value;
  }

  fireEvent.change(select);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CvProjectsManager", () => {
  it("renders only the CV projects with their data", () => {
    renderManager();

    expect(screen.getByText("SaaS Media Platform")).toBeInTheDocument();
    expect(screen.getByText("Business Process Automation")).toBeInTheDocument();
    expect(screen.getByText("IoT")).toBeInTheDocument();
    expect(
      screen.getByText("Managed to write code in time"),
    ).toBeInTheDocument();
    expect(screen.getByText("08/21/2023")).toBeInTheDocument();
    expect(screen.getByText("Till now")).toBeInTheDocument();
    expect(screen.getByText("06/19/2023")).toBeInTheDocument();
  });

  it("shows the empty state when the CV has no projects", () => {
    renderManager({ projects: [] });

    expect(screen.getByText("No projects added yet")).toBeInTheDocument();
  });

  it("filters by name and domain case-insensitively", () => {
    renderManager();

    const search = screen.getByLabelText("Search projects");

    fireEvent.change(search, { target: { value: "AUTOMATION" } });
    expect(screen.getByText("Business Process Automation")).toBeInTheDocument();
    expect(screen.queryByText("SaaS Media Platform")).toBeNull();

    fireEvent.change(search, { target: { value: "iot" } });
    expect(screen.getByText("SaaS Media Platform")).toBeInTheDocument();
    expect(screen.queryByText("Business Process Automation")).toBeNull();

    fireEvent.change(search, { target: { value: "unknown" } });
    expect(screen.getByText("No projects found")).toBeInTheDocument();
  });

  it("sorts by name in both directions", () => {
    renderManager();

    expect(tableRows()[1]).toHaveTextContent("Business Process Automation");

    fireEvent.click(screen.getByRole("button", { name: "Name" }));

    expect(tableRows()[1]).toHaveTextContent("SaaS Media Platform");
  });

  it("sorts by start date and keeps ongoing projects last by end date", () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: "Start Date" }));
    expect(tableRows()[1]).toHaveTextContent("Business Process Automation");

    fireEvent.click(screen.getByRole("button", { name: "End Date" }));
    expect(tableRows()[1]).toHaveTextContent("Business Process Automation");
    expect(tableRows()[3]).toHaveTextContent("SaaS Media Platform");
  });

  it("adds a project with auto-populated catalog data", async () => {
    addCvProjectAction.mockResolvedValue({ success: true });

    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /add project/i }));

    expect(
      screen.getByRole("heading", { name: "Add project" }),
    ).toBeInTheDocument();

    const projectSelect = screen.getByLabelText("Name") as HTMLSelectElement;
    const addButton = screen.getByRole("button", { name: "Add" });

    expect(addButton).toBeDisabled();
    expect(
      Array.from(projectSelect.options, (option) => option.textContent),
    ).toEqual(["Name", "Data Warehouse"]);

    fireEvent.change(projectSelect, { target: { value: "project-3" } });

    expect(screen.getByLabelText("Domain")).toHaveValue("Analytics");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Analytics platform.",
    );
    expect(screen.getByLabelText("Start Date")).toHaveValue("2024-01-01");
    expect(screen.getByLabelText("End Date")).toHaveValue("2024-12-31");

    const environment = screen.getByLabelText(
      "Environment",
    ) as HTMLSelectElement;
    expect(
      Array.from(environment.selectedOptions, (option) => option.value),
    ).toEqual(["SQL"]);

    expect(addButton).toBeDisabled();

    selectRoles("Frontend Developer");

    await waitFor(() => expect(addButton).toBeEnabled());
    fireEvent.click(addButton);

    await waitFor(() =>
      expect(addCvProjectAction).toHaveBeenCalledWith("cv-1", {
        projectId: "project-3",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        roles: ["Frontend Developer"],
        responsibilities: "",
      }),
    );
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(
      screen.queryByRole("heading", { name: "Add project" }),
    ).toBeNull();
    expect(toastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success" }),
    );
  });

  it("shows inline errors for dates outside the project duration", async () => {
    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /add project/i }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "project-3" },
    });
    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2023-12-31" },
    });
    selectRoles("Frontend Developer");

    expect(
      await screen.findByText("Start date must be within project duration"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("keeps the add form values and shows a system error when saving fails", async () => {
    addCvProjectAction.mockResolvedValue({
      success: false,
      error: "Something went wrong",
      code: null,
    });

    renderManager();

    fireEvent.click(screen.getByRole("button", { name: /add project/i }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "project-3" },
    });
    selectRoles("Backend Developer");

    const addButton = screen.getByRole("button", { name: "Add" });
    await waitFor(() => expect(addButton).toBeEnabled());
    fireEvent.click(addButton);

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("project-3");
    expect(screen.getByLabelText("Roles")).toHaveValue(["Backend Developer"]);
    expect(refresh).not.toHaveBeenCalled();
    expect(toastAdd).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error" }),
    );
  });

  it("updates a project and disables Save until a change is made", async () => {
    updateCvProjectAction.mockResolvedValue({ success: true });

    renderManager();

    fireEvent.click(
      screen.getAllByRole("button", { name: "Update" })[0],
    );

    expect(
      screen.getByRole("heading", { name: "Update project" }),
    ).toBeInTheDocument();

    const name = screen.getByLabelText("Name") as HTMLSelectElement;
    expect(name).toBeDisabled();
    expect(name).toHaveValue("project-2");
    expect(screen.getByLabelText("Start Date")).toHaveValue("2023-01-20");
    expect(screen.getByLabelText("End Date")).toHaveValue("2023-06-19");
    expect(screen.getByLabelText("Roles")).toHaveValue(["Backend Developer"]);
    expect(screen.getByLabelText("Responsibilities")).toHaveValue(
      "Did something great\nDid not break production",
    );

    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Responsibilities"), {
      target: { value: "Did something great" },
    });

    await waitFor(() => expect(saveButton).toBeEnabled());
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(updateCvProjectAction).toHaveBeenCalledWith("cv-1", {
        projectId: "project-2",
        startDate: "2023-01-20",
        endDate: "2023-06-19",
        roles: ["Backend Developer"],
        responsibilities: "Did something great",
      }),
    );
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(
      screen.queryByRole("heading", { name: "Update project" }),
    ).toBeNull();
  });

  it("validates updated dates against the project duration", async () => {
    renderManager();

    fireEvent.click(screen.getAllByRole("button", { name: "Update" })[0]);

    fireEvent.change(screen.getByLabelText("Start Date"), {
      target: { value: "2023-01-01" },
    });

    expect(
      await screen.findByText("Start date must be within project duration"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("removes a project after confirmation", async () => {
    removeCvProjectAction.mockResolvedValue({ success: true });

    renderManager();

    fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    expect(
      screen.getByRole("heading", { name: "Remove project" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() =>
      expect(removeCvProjectAction).toHaveBeenCalledWith("cv-1", "project-2"),
    );
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect(
      screen.queryByRole("heading", { name: "Remove project" }),
    ).toBeNull();
  });

  it("keeps the remove dialog open and shows an error when deletion fails", async () => {
    removeCvProjectAction.mockResolvedValue({
      success: false,
      error: "Something went wrong",
      code: null,
    });

    renderManager();

    fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Remove project" }),
    ).toBeInTheDocument();
    expect(refresh).not.toHaveBeenCalled();
  });
});
