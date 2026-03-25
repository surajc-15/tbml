import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchFilter } from "@/components/ui/search-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { suspiciousTransactions } from "@/lib/mock-data";
import { SuspiciousRowActions } from "@/components/dashboard/suspicious-row-actions";

type Props = {
  query?: string;
  page?: number;
};

const PAGE_SIZE = 4;

export async function SuspiciousTransactionsTable({ query = "", page = 1 }: Props) {
  const normalized = query.toLowerCase();
  const filtered = suspiciousTransactions.filter((item) => {
    return (
      item.transactionId.toLowerCase().includes(normalized) ||
      item.sender.toLowerCase().includes(normalized) ||
      item.receiver.toLowerCase().includes(normalized) ||
      item.tradeType.toLowerCase().includes(normalized) ||
      item.suspicionReason.toLowerCase().includes(normalized)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle>Section 2: Suspicious Transactions</CardTitle>
          <CardDescription>Transactions requiring analyst review before escalation to confirmed fraud.</CardDescription>
        </div>
        <SearchFilter
          searchParam="suspiciousSearch"
          pageParam="suspiciousPage"
          placeholder="Search sender, receiver, trade type or reason"
          defaultValue={query}
        />
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        {paginated.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyState
              title="No suspicious transactions"
              description="Try a different search term or reset filters to view all records."
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Trade Type</TableHead>
                  <TableHead>Suspicion Reason</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((txn) => (
                  <TableRow key={txn.transactionId}>
                    <TableCell className="font-semibold text-slate-800">{txn.transactionId}</TableCell>
                    <TableCell>{txn.sender}</TableCell>
                    <TableCell>{txn.receiver}</TableCell>
                    <TableCell>${txn.amount.toLocaleString()}</TableCell>
                    <TableCell>{txn.tradeType}</TableCell>
                    <TableCell className="max-w-80 text-pretty">{txn.suspicionReason}</TableCell>
                    <TableCell>
                      <Badge variant="suspicious">Medium</Badge>
                    </TableCell>
                    <TableCell className="min-w-[640px]">
                      <SuspiciousRowActions transaction={txn} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationControls pageParam="suspiciousPage" currentPage={currentPage} totalPages={totalPages} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
