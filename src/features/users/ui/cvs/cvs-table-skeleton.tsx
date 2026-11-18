import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

const COLUMNS = ["Name", "Education", "Employee", ""];

export function CvsTableSkeleton() {
  return (
    <Table className="text-xs">
      <TableHeader>
        <TableRow className="border-b border-border hover:bg-transparent">
          {COLUMNS.map((label, index) => (
            <TableHead
              key={`${label}-${index}`}
              className="text-xs font-semibold text-foreground"
            >
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={COLUMNS.length}
            aria-busy="true"
            className="h-24 text-center text-sm text-muted-foreground"
          >
            Loading CVs...
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
