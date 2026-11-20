"use client";

import { Fragment, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import {
  formatProjectDate,
  type CvProjectOption,
  type CvProjectRecord,
} from "../model/cv-project-record";
import type { ProjectBounds } from "../model/cv-project-schema";
import { CvProjectDialog } from "./cv-project-dialog";
import { CvProjectRemoveDialog } from "./cv-project-remove-dialog";

type SortField = "name" | "startDate" | "endDate";
type SortOrder = "asc" | "desc";

const COLUMN_COUNT = 6;

type Props = {
  cvId: string;
  projects: CvProjectRecord[];
  catalog: CvProjectOption[];
  roles: string[];
};

function compareProjects(
  a: CvProjectRecord,
  b: CvProjectRecord,
  field: SortField,
  order: SortOrder,
): number {
  if (field === "endDate") {
    if (!a.endDate && !b.endDate) {
      return 0;
    }

    if (!a.endDate) {
      return 1;
    }

    if (!b.endDate) {
      return -1;
    }
  }

  let result: number;

  if (field === "name") {
    result = a.name.localeCompare(b.name);
  } else if (field === "startDate") {
    result = a.startDate.localeCompare(b.startDate);
  } else {
    result = (a.endDate ?? "").localeCompare(b.endDate ?? "");
  }

  return order === "asc" ? result : -result;
}

function ProjectSortHeader({
  field,
  label,
  sortField,
  sortOrder,
  onSort,
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}) {
  const active = sortField === field;
  const SortIcon = !active
    ? ArrowUpDown
    : sortOrder === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <TableHead
      aria-sort={
        active ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-foreground outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/30"
      >
        {label}
        <SortIcon
          aria-hidden="true"
          className={active ? "size-3.5 text-primary" : "size-3.5 opacity-50"}
        />
      </button>
    </TableHead>
  );
}

export function CvProjectsManager({ cvId, projects, catalog, roles }: Props) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<CvProjectRecord | null>(null);
  const [removing, setRemoving] = useState<CvProjectRecord | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const query = search.trim().toLowerCase();

  const visible = useMemo(() => {
    const filtered = query
      ? projects.filter(
          (project) =>
            project.name.toLowerCase().includes(query) ||
            project.domain.toLowerCase().includes(query),
        )
      : projects;

    return [...filtered].sort((a, b) =>
      compareProjects(a, b, sortField, sortOrder),
    );
  }, [projects, query, sortField, sortOrder]);

  const assignedIds = new Set(projects.map((project) => project.id));
  const assignable = catalog.filter((option) => !assignedIds.has(option.id));

  const emptyMessage =
    projects.length === 0 ? "No projects added yet" : "No projects found";

  function boundsFor(projectId: string): ProjectBounds | null {
    const option = catalog.find((item) => item.id === projectId);

    return option
      ? { startDate: option.startDate, endDate: option.endDate }
      : null;
  }

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortOrder("asc");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            aria-label="Search projects"
            className="h-10 rounded-full pl-9"
          />
        </div>

        <Button
          variant="default"
          onClick={() => setAddOpen(true)}
          className="shrink-0"
        >
          <PlusIcon className="size-4" />
          Add Project
        </Button>
      </div>

      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <ProjectSortHeader
              field="name"
              label="Name"
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <TableHead className="text-xs font-semibold text-foreground">
              Domain
            </TableHead>
            <TableHead className="text-xs font-semibold text-foreground">
              Responsibilities
            </TableHead>
            <ProjectSortHeader
              field="startDate"
              label="Start Date"
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <ProjectSortHeader
              field="endDate"
              label="End Date"
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {visible.length > 0 ? (
            visible.map((project) => (
              <Fragment key={project.id}>
                <TableRow className="border-b-0">
                  <TableCell className="pt-4 pb-2 align-top text-xs text-foreground">
                    {project.name}
                  </TableCell>
                  <TableCell className="pt-4 pb-2 align-top text-xs text-foreground">
                    {project.domain}
                  </TableCell>
                  <TableCell className="max-w-64 pt-4 pb-2 align-top text-xs whitespace-normal">
                    {project.responsibilities.length > 0 ? (
                      <span className="flex flex-wrap gap-1.5">
                        {project.responsibilities.map((responsibility) => (
                          <span
                            key={responsibility}
                            className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[10px] text-foreground"
                          >
                            {responsibility}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="pt-4 pb-2 align-top text-xs text-foreground">
                    {formatProjectDate(project.startDate)}
                  </TableCell>
                  <TableCell className="pt-4 pb-2 align-top text-xs text-foreground">
                    {project.endDate
                      ? formatProjectDate(project.endDate)
                      : "Till now"}
                  </TableCell>
                  <TableCell className="pt-2 pb-2 text-right align-top">
                    <DropdownMenu
                      open={openMenuId === project.id}
                      onOpenChange={(open) =>
                        setOpenMenuId(open ? project.id : null)
                      }
                    >
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="icon"
                            aria-label={`Actions for project ${project.name}`}
                            className="size-8"
                          />
                        }
                      >
                        <MoreVerticalIcon className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-auto min-w-32">
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenMenuId(null);
                            setEditing(project);
                          }}
                        >
                          Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setOpenMenuId(null);
                            setRemoving(project);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-border">
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className="pt-0 pr-16 pb-4 text-xs leading-relaxed whitespace-normal text-muted-foreground"
                  >
                    {project.description}
                  </TableCell>
                </TableRow>
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CvProjectDialog
        mode="add"
        cvId={cvId}
        open={addOpen}
        onOpenChange={setAddOpen}
        options={assignable}
        roles={roles}
      />

      {editing && (
        <CvProjectDialog
          mode="update"
          cvId={cvId}
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditing(null);
            }
          }}
          project={editing}
          bounds={boundsFor(editing.id)}
          roles={roles}
        />
      )}

      <CvProjectRemoveDialog
        cvId={cvId}
        project={removing}
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRemoving(null);
          }
        }}
      />
    </div>
  );
}
