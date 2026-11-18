import type { CvRecord } from "../../model/cv-record";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { CvActionsMenu } from "./cv-actions-menu";
import { CvsSortHeader } from "./cvs-sort-header";

type CvsTableProps = {
  userId: string;
  cvs: CvRecord[];
  employee: string;
  sortBy?: string;
  sortOrder?: string;
};

export function CvsTable({
  userId,
  cvs,
  employee,
  sortBy,
  sortOrder,
}: CvsTableProps) {
  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow className="border-b border-border hover:bg-transparent">
          <CvsSortHeader sortBy={sortBy} sortOrder={sortOrder} />
          <TableHead className="w-[28%] text-xs font-semibold text-foreground">
            Education
          </TableHead>
          <TableHead className="text-xs font-semibold text-foreground">
            Employee
          </TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {cvs.length > 0 ? (
          cvs.map((cv) => (
            <TableRow
              key={cv.id}
              className="border-b border-border transition-colors hover:bg-muted/40"
            >
              <TableCell className="py-4 text-xs text-foreground">
                {cv.name}
              </TableCell>
              <TableCell className="py-4 text-xs text-foreground">
                {cv.education ?? ""}
              </TableCell>
              <TableCell className="py-4 text-xs text-foreground">
                {employee}
              </TableCell>
              <TableCell className="py-2 text-right">
                <CvActionsMenu userId={userId} cv={cv} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              className="h-24 text-center text-sm text-muted-foreground"
            >
              No CVs found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
