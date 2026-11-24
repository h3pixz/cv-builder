import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export function AdminDepartmentsTableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-100 table-fixed">
        <TableHeader>
          <TableRow className="h-11 border-b border-border hover:bg-transparent">
            {["Name", "Actions"].map((label) => (
              <TableHead
                key={label}
                className="px-3 text-xs font-semibold text-foreground"
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={2}
              aria-busy="true"
              className="h-24 text-center text-sm text-muted-foreground"
            >
              Loading departments...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
