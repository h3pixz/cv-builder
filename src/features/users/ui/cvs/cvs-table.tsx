import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { CvActionsMenu } from "./cv-actions-menu";

type Cv = {
  id: string;
  name: string;
  education?: string | null;
  description: string;
};

export function CvsTable({ cvs, employee }: { cvs: Cv[]; employee: string }) {
  if (cvs.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No CVs found.
      </p>
    );
  }

  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[40%]">Name</TableHead>
          <TableHead className="w-[28%]">Education</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {cvs.flatMap((cv) => [
          <TableRow key={cv.id} className="border-b-0 hover:bg-transparent">
            <TableCell className="py-4">{cv.name}</TableCell>
            <TableCell>{cv.education ?? ""}</TableCell>
            <TableCell>{employee}</TableCell>
            <TableCell className="text-right">
              <CvActionsMenu cvId={cv.id} />
            </TableCell>
          </TableRow>,
          <TableRow
            key={`${cv.id}-description`}
            className="hover:bg-transparent"
          >
            <TableCell
              colSpan={4}
              className="pb-5 leading-relaxed whitespace-normal text-muted-foreground"
            >
              {cv.description}
            </TableCell>
          </TableRow>,
        ])}
      </TableBody>
    </Table>
  );
}
