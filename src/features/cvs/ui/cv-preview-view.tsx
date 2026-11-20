import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { isPreviewAvailable, type CvPreview } from "../model/cv-preview";
import { CvPreviewExportButton } from "./cv-preview-export-button";

function MetaBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {values.map((value, index) => (
        <p key={`${index}-${value}`} className="text-sm text-foreground">
          {value}
        </p>
      ))}
    </div>
  );
}

function DetailBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-foreground">{title}</h4>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function CvPreviewView({
  cvId,
  preview,
}: {
  cvId: string;
  preview: CvPreview;
}) {
  if (!isPreviewAvailable(preview)) {
    return (
      <section className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          CV preview is not available
        </p>
        <CvPreviewExportButton cvId={cvId} disabled />
      </section>
    );
  }

  const meta: { title: string; values: string[] }[] = [];

  if (preview.education) {
    meta.push({ title: "Education", values: [preview.education] });
  }

  if (preview.languages.length > 0) {
    meta.push({
      title: "Language proficiency",
      values: preview.languages.map(
        (language) => `${language.name} — ${language.proficiency}`,
      ),
    });
  }

  if (preview.domains.length > 0) {
    meta.push({ title: "Domains", values: preview.domains });
  }

  return (
    <article className="max-w-5xl space-y-14">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-normal text-foreground sm:text-4xl">
            {preview.fullName}
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {preview.position}
          </p>
        </div>
        <CvPreviewExportButton cvId={cvId} />
      </header>

      <section className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <div className="space-y-6">
          {meta.map((block) => (
            <MetaBlock
              key={block.title}
              title={block.title}
              values={block.values}
            />
          ))}
        </div>

        <div className="space-y-8 lg:border-l lg:border-border lg:pl-10">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-foreground">
              {preview.name}
            </h2>
            <p className="text-sm leading-relaxed text-foreground">
              {preview.description}
            </p>
          </div>

          {preview.skillGroups.length > 0 && (
            <div className="space-y-4">
              {preview.skillGroups.map((group) => (
                <div key={group.id} className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">
                    {group.name}
                  </h3>
                  <p className="text-sm text-foreground">
                    {group.skills.map((skill) => skill.name).join(", ")}.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {preview.projects.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-normal text-foreground">Projects</h2>

          <div className="space-y-10">
            {preview.projects.map((project) => (
              <div
                key={project.id}
                className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-[0.02em] text-primary">
                    {project.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 lg:border-l lg:border-border lg:pl-10">
                  {project.roles.length > 0 && (
                    <DetailBlock
                      title="Project roles"
                      value={project.roles.join(", ")}
                    />
                  )}

                  <DetailBlock title="Period" value={project.period} />

                  {project.responsibilities.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground">
                        Responsibilities
                      </h4>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
                        {project.responsibilities.map((item, index) => (
                          <li key={`${index}-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.environment.length > 0 && (
                    <DetailBlock
                      title="Environment"
                      value={project.environment.join(", ")}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {preview.professionalSkills.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-normal text-foreground">
            Professional skills
          </h2>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-56 text-[10px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
                  Skills Category
                </TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
                  Skill
                </TableHead>
                <TableHead className="text-center text-[10px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
                  Experience in Years
                </TableHead>
                <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.02em] text-muted-foreground">
                  Last Used
                </TableHead>
              </TableRow>
            </TableHeader>

            {preview.professionalSkills.map((group) => (
              <TableBody key={group.category}>
                {group.rows.map((row, index) => (
                  <TableRow
                    key={`${group.category}-${row.name}`}
                    className={
                      index === 0
                        ? "border-t border-border hover:bg-transparent"
                        : "hover:bg-transparent"
                    }
                  >
                    {index === 0 && (
                      <TableCell
                        rowSpan={group.rows.length}
                        className="align-top font-medium text-primary"
                      >
                        {group.category}
                      </TableCell>
                    )}
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="text-center">
                      {row.experienceYears ?? ""}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.lastUsed ?? ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ))}
          </Table>
        </section>
      )}
    </article>
  );
}
