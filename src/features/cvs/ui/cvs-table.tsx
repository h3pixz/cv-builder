import { Fragment } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import type { CvRecord } from "../model/cv-record";
import { CvActionsMenu } from "./cv-actions-menu";
import { CvsSortHeader } from "./cvs-sort-header";

type CvsTableProps = {
  cvs: CvRecord[];
  emptyMessage: string;
  showEmployee?: boolean;
  sortBy?: string;
  sortOrder?: string;
};

export function CvsTable({
  cvs,
  emptyMessage,
  showEmployee = true,
  sortBy,
  sortOrder,
}: CvsTableProps) {
  const columnCount = showEmployee ? 4 : 3;

  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow className="border-b border-border hover:bg-transparent">
          <CvsSortHeader sortBy={sortBy} sortOrder={sortOrder} />
          <TableHead className="w-[28%] text-xs font-semibold text-foreground">
            Education
          </TableHead>
          {showEmployee && (
            <TableHead className="text-xs font-semibold text-foreground">
              Employee
            </TableHead>
          )}
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {cvs.length > 0 ? (
          cvs.map((cv) => (
            <Fragment key={cv.id}>
              <TableRow className="border-b-0">
                <TableCell className="pt-4 pb-2 text-xs text-foreground">
                  {cv.name}
                </TableCell>
                <TableCell className="pt-4 pb-2 text-xs text-foreground">
                  {cv.education ?? ""}
                </TableCell>
                {showEmployee && (
                  <TableCell className="pt-4 pb-2 text-xs text-foreground">
                    {cv.ownerEmail}
                  </TableCell>
                )}
                <TableCell className="pt-2 pb-2 text-right align-top">
                  <CvActionsMenu cv={cv} />
                </TableCell>
              </TableRow>
              <TableRow className="border-b border-border">
                <TableCell
                  colSpan={columnCount}
                  className="pt-0 pr-16 pb-4 text-xs leading-relaxed whitespace-normal text-muted-foreground"
                >
                  {cv.description}
                </TableCell>
              </TableRow>
            </Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columnCount}
              className="h-24 text-center text-sm text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
