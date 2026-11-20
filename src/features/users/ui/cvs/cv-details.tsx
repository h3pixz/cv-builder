import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { proficiencyLevel } from "@/features/languages";
import { masteryLevel } from "@/features/skills";
import type { GetCvQuery } from "@/shared/api/graphql/generated/graphql";
import { Button } from "@/shared/ui/button";
import { Level } from "@/shared/ui/level";

type Cv = GetCvQuery["cv"];

function employeeName(cv: Cv): string {
  const profile = cv.user?.profile;
  const fullName =
    profile?.full_name ||
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();

  return fullName || cv.user?.email || "";
}

function period(start: string, end?: string | null): string {
  return `${start} — ${end || "Present"}`;
}

export function CvDetails({ userId, cv }: { userId: string; cv: Cv }) {
  const projects = cv.projects ?? [];

  return (
    <article className="mx-auto w-full max-w-4xl space-y-8">
      <div className="flex items-start gap-2">
        <Button
          variant="icon"
          aria-label="Back to CVs"
          className="size-8 shrink-0"
          nativeButton={false}
          render={<Link href={`/users/${userId}/cvs`} />}
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-foreground">{cv.name}</h1>
          <p className="text-sm text-muted-foreground">
            {employeeName(cv)}
            {cv.user?.email && employeeName(cv) !== cv.user.email
              ? ` · ${cv.user.email}`
              : ""}
          </p>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold tracking-[0.02em] text-foreground uppercase">
          Education
        </h2>
        <p className="text-sm text-foreground">{cv.education || "—"}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold tracking-[0.02em] text-foreground uppercase">
          Description
        </h2>
        <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">
          {cv.description}
        </p>
      </section>

      {cv.skills.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-[0.02em] text-foreground uppercase">
            Skills
          </h2>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {cv.skills.map((skill) => (
              <li
                key={skill.name}
                className="flex items-center justify-between gap-4 border-b border-border pb-2"
              >
                <span className="text-sm text-foreground">{skill.name}</span>
                <Level
                  level={masteryLevel(skill.mastery)}
                  label={skill.mastery}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {cv.languages.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-[0.02em] text-foreground uppercase">
            Languages
          </h2>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
            {cv.languages.map((language) => (
              <li
                key={language.name}
                className="flex items-center justify-between gap-4 border-b border-border pb-2"
              >
                <span className="text-sm text-foreground">{language.name}</span>
                <Level
                  level={proficiencyLevel(language.proficiency)}
                  label={language.proficiency}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {projects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-[0.02em] text-foreground uppercase">
            Projects
          </h2>
          <ul className="space-y-6">
            {projects.map((project) => (
              <li key={project.id} className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {period(project.start_date, project.end_date)}
                  </p>
                </div>

                {project.description && (
                  <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">
                    {project.description}
                  </p>
                )}

                {project.roles.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Roles:{" "}
                    </span>
                    {project.roles.join(", ")}
                  </p>
                )}

                {project.responsibilities.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
                    {project.responsibilities.map((responsibility) => (
                      <li key={responsibility}>{responsibility}</li>
                    ))}
                  </ul>
                )}

                {project.environment.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Environment:{" "}
                    </span>
                    {project.environment.join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
