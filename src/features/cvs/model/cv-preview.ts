import { groupSkills } from "@/shared/helpers";

type PreviewLanguage = {
  name: string;
  proficiency: string;
};

type PreviewSkill = {
  name: string;
  categoryId?: string | null;
  mastery: string;
};

type PreviewProject = {
  name: string;
  description: string;
  domain: string;
  start_date: string;
  end_date: string | null;
  environment: string[];
  roles: string[];
  responsibilities: string[];
};

type PreviewProfile = {
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  languages: PreviewLanguage[];
};

type PreviewCategory = {
  id: string;
  name: string;
  order: number;
  children: { id: string; name: string; order: number }[];
};

export type CvPreviewSource = {
  name: string;
  education?: string | null;
  description: string;
  skills: PreviewSkill[];
  projects?: PreviewProject[] | null;
  user?: {
    position?: { name: string } | null;
    profile?: PreviewProfile | null;
  } | null;
};

export type CvPreview = {
  fullName: string;
  position: string | null;
  education: string | null;
  languages: PreviewLanguage[];
  domains: string[];
  name: string;
  description: string;
  skillGroups: {
    id: string;
    name: string;
    skills: { name: string; mastery: string }[];
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    roles: string[];
    period: string;
    responsibilities: string[];
    environment: string[];
  }[];
  professionalSkills: {
    category: string;
    rows: {
      name: string;
      experienceYears: number | null;
      lastUsed: number | null;
    }[];
  }[];
};

type DateParts = { year: number; month: number; day: number };

function parseDate(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function dateKey(date: DateParts): number {
  return date.year * 10000 + date.month * 100 + date.day;
}

export function formatMonthYear(value: string): string {
  const date = parseDate(value);

  if (!date) {
    return value;
  }

  return `${String(date.month).padStart(2, "0")}.${date.year}`;
}

export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonthYear(start)} - ${end ? formatMonthYear(end) : "Present"}`;
}

function fullNameOf(profile: PreviewProfile | null | undefined): string {
  const composed = [profile?.first_name, profile?.last_name]
    .map((part) => part?.trim() ?? "")
    .filter(Boolean)
    .join(" ");

  return composed || profile?.full_name?.trim() || "";
}

function uniqueDomains(projects: PreviewProject[]): string[] {
  const domains: string[] = [];
  const seen = new Set<string>();

  for (const project of projects) {
    const domain = project.domain.trim();
    const key = domain.toLowerCase();

    if (domain && !seen.has(key)) {
      seen.add(key);
      domains.push(domain);
    }
  }

  return domains;
}

function matchingProjects(
  projects: PreviewProject[],
  skillName: string,
): PreviewProject[] {
  const needle = skillName.trim().toLowerCase();

  return projects.filter((project) =>
    project.environment.some((item) => item.trim().toLowerCase() === needle),
  );
}

function fullYearsSince(start: DateParts, now: Date): number {
  let years = now.getFullYear() - start.year;
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if (month < start.month || (month === start.month && day < start.day)) {
    years -= 1;
  }

  return Math.max(0, years);
}

function experienceYears(
  matches: PreviewProject[],
  now: Date,
): number | null {
  let earliest: DateParts | null = null;

  for (const project of matches) {
    const start = parseDate(project.start_date);

    if (start && (!earliest || dateKey(start) < dateKey(earliest))) {
      earliest = start;
    }
  }

  return earliest ? fullYearsSince(earliest, now) : null;
}

function lastUsedYear(
  matches: PreviewProject[],
  now: Date,
): number | null {
  let hasActive = false;
  let latest: DateParts | null = null;

  for (const project of matches) {
    if (!project.end_date) {
      hasActive = true;
      continue;
    }

    const end = parseDate(project.end_date);

    if (end && (!latest || dateKey(end) > dateKey(latest))) {
      latest = end;
    }
  }

  if (hasActive) {
    return now.getFullYear();
  }

  return latest?.year ?? null;
}

export function buildCvPreview(
  source: CvPreviewSource,
  categories: PreviewCategory[],
  now: Date = new Date(),
): CvPreview {
  const projects = source.projects ?? [];
  const groups = groupSkills(source.skills, categories);

  return {
    fullName: fullNameOf(source.user?.profile),
    position: source.user?.position?.name?.trim() || null,
    education: source.education?.trim() || null,
    languages: (source.user?.profile?.languages ?? []).map((language) => ({
      name: language.name,
      proficiency: language.proficiency,
    })),
    domains: uniqueDomains(projects),
    name: source.name,
    description: source.description,
    skillGroups: groups.map((group) => ({
      id: group.id,
      name: group.name,
      skills: group.skills.map((skill) => ({
        name: skill.name,
        mastery: skill.mastery,
      })),
    })),
    projects: projects.map((project, index) => ({
      id: `${index}`,
      name: project.name,
      description: project.description,
      roles: project.roles.filter(Boolean),
      period: formatPeriod(project.start_date, project.end_date),
      responsibilities: project.responsibilities.filter(
        (item) => item.trim().length > 0,
      ),
      environment: project.environment.filter(Boolean),
    })),
    professionalSkills: groups.map((group) => ({
      category: group.name,
      rows: group.skills.map((skill) => {
        const matches = matchingProjects(projects, skill.name);

        return {
          name: skill.name,
          experienceYears: experienceYears(matches, now),
          lastUsed: lastUsedYear(matches, now),
        };
      }),
    })),
  };
}

export function isPreviewAvailable(preview: CvPreview): boolean {
  return Boolean(preview.fullName && preview.position);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraphs(values: string[]): string {
  return values
    .map((value) => `<p>${escapeHtml(value)}</p>`)
    .join("");
}

function metaBlock(title: string, values: string[]): string {
  return `<div class="meta-item"><h3>${escapeHtml(title)}</h3>${paragraphs(values)}</div>`;
}

function skillsHtml(preview: CvPreview): string {
  return preview.skillGroups
    .map(
      (group) =>
        `<div class="skill-group"><h3>${escapeHtml(group.name)}</h3><p>${escapeHtml(
          group.skills.map((skill) => skill.name).join(", "),
        )}.</p></div>`,
    )
    .join("");
}

function projectHtml(project: CvPreview["projects"][number]): string {
  const details: string[] = [];

  if (project.roles.length > 0) {
    details.push(
      `<div class="detail"><h3>Project roles</h3><p>${escapeHtml(
        project.roles.join(", "),
      )}</p></div>`,
    );
  }

  details.push(
    `<div class="detail"><h3>Period</h3><p>${escapeHtml(project.period)}</p></div>`,
  );

  if (project.responsibilities.length > 0) {
    details.push(
      `<div class="detail"><h3>Responsibilities</h3><ul>${project.responsibilities
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul></div>`,
    );
  }

  if (project.environment.length > 0) {
    details.push(
      `<div class="detail"><h3>Environment</h3><p>${escapeHtml(
        project.environment.join(", "),
      )}</p></div>`,
    );
  }

  return `<div class="project"><div class="project-meta"><h3>${escapeHtml(
    project.name,
  )}</h3><p>${escapeHtml(project.description)}</p></div><div class="project-details">${details.join(
    "",
  )}</div></div>`;
}

function professionalSkillsHtml(preview: CvPreview): string {
  const rows = preview.professionalSkills
    .map(
      (group) =>
        `<tbody>${group.rows
          .map(
            (row, index) =>
              `<tr>${
                index === 0
                  ? `<td class="category-name" rowspan="${group.rows.length}">${escapeHtml(
                      group.category,
                    )}</td>`
                  : ""
              }<td>${escapeHtml(row.name)}</td><td>${row.experienceYears ?? ""}</td><td>${
                row.lastUsed ?? ""
              }</td></tr>`,
          )
          .join("")}</tbody>`,
    )
    .join("");

  return `<table><thead><tr><th>Skills Category</th><th>Skill</th><th>Experience in Years</th><th>Last Used</th></tr></thead>${rows}</table>`;
}

const PDF_STYLES = `
*{box-sizing:border-box}
body{margin:0;font-family:Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#333333;background:#ffffff}
h1{margin:0;font-size:30px;font-weight:400}
h2{margin:0 0 12px;font-size:24px;font-weight:400}
h3{margin:0 0 4px;font-size:12px;font-weight:700}
p{margin:0}
ul{margin:0;padding-left:18px}
li{margin-bottom:4px}
.header{display:flex;justify-content:space-between;align-items:flex-start;gap:24px}
.position{margin-top:4px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#626262}
.section{display:flex;gap:32px;margin-top:40px;page-break-inside:avoid}
.meta{width:220px;flex:none}
.main{flex:1;border-left:1px solid #bebebe;padding-left:32px}
.meta-item{margin-bottom:18px}
.skill-group{margin-bottom:16px}
.project{display:flex;gap:32px;margin-top:24px;page-break-inside:avoid}
.project-meta{width:220px;flex:none}
.project-meta h3{color:#c63031;text-transform:uppercase;letter-spacing:0.04em}
.project-details{flex:1;border-left:1px solid #bebebe;padding-left:32px}
.detail{margin-bottom:14px}
table{width:100%;border-collapse:collapse;margin-top:16px}
th{font-size:10px;text-transform:uppercase;letter-spacing:0.04em;color:#626262;text-align:left;padding:8px 6px;border-bottom:1px solid #bebebe}
td{padding:8px 6px;border-bottom:1px solid #e2e2e4;vertical-align:top}
tbody tr:first-child td{border-top:1px solid #bebebe}
.category-name{color:#c63031;font-weight:700;width:200px}
`;

export function buildCvPreviewHtml(preview: CvPreview): string {
  const meta = [
    preview.education ? metaBlock("Education", [preview.education]) : "",
    preview.languages.length > 0
      ? metaBlock(
          "Language proficiency",
          preview.languages.map(
            (language) => `${language.name} — ${language.proficiency}`,
          ),
        )
      : "",
    preview.domains.length > 0 ? metaBlock("Domains", preview.domains) : "",
  ]
    .filter(Boolean)
    .join("");

  const skills = skillsHtml(preview);

  const projects =
    preview.projects.length > 0
      ? `<section><h2>Projects</h2>${preview.projects
          .map(projectHtml)
          .join("")}</section>`
      : "";

  const professionalSkills =
    preview.professionalSkills.length > 0
      ? `<section><h2>Professional skills</h2>${professionalSkillsHtml(
          preview,
        )}</section>`
      : "";

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(
    preview.name,
  )}</title><style>${PDF_STYLES}</style></head><body><header class="header"><div><h1>${escapeHtml(
    preview.fullName,
  )}</h1><p class="position">${escapeHtml(
    preview.position ?? "",
  )}</p></div></header><section class="section"><div class="meta">${meta}</div><div class="main"><div class="skill-group"><h2>${escapeHtml(
    preview.name,
  )}</h2><p>${escapeHtml(
    preview.description,
  )}</p></div>${skills}</div></section>${projects}${professionalSkills}</body></html>`;
}

export function toPdfFileName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "cv"}.pdf`;
}
