export type CvRecord = {
  id: string;
  name: string;
  education: string | null;
  description: string;
  ownerId: string | null;
  ownerEmail: string;
};

export type CvListItem = {
  id: string;
  name: string;
  education?: string | null;
  description: string;
  user?: { id: string; email: string } | null;
};

export function toCvRecord(item: CvListItem): CvRecord {
  return {
    id: item.id,
    name: item.name,
    education: item.education ?? null,
    description: item.description,
    ownerId: item.user?.id ?? null,
    ownerEmail: item.user?.email ?? "",
  };
}
