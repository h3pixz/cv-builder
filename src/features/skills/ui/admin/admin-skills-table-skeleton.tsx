import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export function AdminSkillsTableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-150 table-fixed">
        <TableHeader>
          <TableRow className="h-11 border-b border-border hover:bg-transparent">
            {["Name", "Type", "Category", ""].map((label, index) => (
              <TableHead
                key={`${label}-${index}`}
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
              colSpan={4}
              aria-busy="true"
              className="h-24 text-center text-sm text-muted-foreground"
            >
              Loading skills...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
