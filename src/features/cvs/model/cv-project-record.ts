export type CvProjectRecord = {
  id: string;
  name: string;
  description: string;
  domain: string;
  startDate: string;
  endDate: string | null;
  environment: string[];
  roles: string[];
  responsibilities: string[];
};

export type CvProjectOption = {
  id: string;
  name: string;
  domain: string;
  description: string;
  startDate: string;
  endDate: string | null;
  environment: string[];
};

type CvProjectSource = {
  name: string;
  description: string;
  domain: string;
  start_date: string;
  end_date: string | null;
  environment: string[];
  roles: string[];
  responsibilities: string[];
  project: { id: string };
};

type ProjectSource = {
  id: string;
  name: string;
  domain: string;
  description: string;
  start_date: string;
  end_date: string | null;
  environment: string[];
};

export function toCvProjectRecord(project: CvProjectSource): CvProjectRecord {
  return {
    id: project.project.id,
    name: project.name,
    description: project.description,
    domain: project.domain,
    startDate: project.start_date,
    endDate: project.end_date || null,
    environment: project.environment,
    roles: project.roles,
    responsibilities: project.responsibilities,
  };
}

export function toCvProjectOption(project: ProjectSource): CvProjectOption {
  return {
    id: project.id,
    name: project.name,
    domain: project.domain,
    description: project.description,
    startDate: project.start_date,
    endDate: project.end_date || null,
    environment: project.environment,
  };
}

export function formatProjectDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) {
    return value;
  }

  return `${match[2]}/${match[3]}/${match[1]}`;
}
