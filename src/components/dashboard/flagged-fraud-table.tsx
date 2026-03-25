import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { RiskSliderFilter } from "@/components/ui/risk-slider-filter";
import { SearchFilter } from "@/components/ui/search-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flaggedFraudAccounts } from "@/lib/mock-data";
import { FraudRowActions } from "@/components/dashboard/fraud-row-actions";

type Props = {
  query?: string;
  page?: number;
  minRisk?: number;
};

const PAGE_SIZE = 4;

export async function FlaggedFraudTable({ query = "", page = 1, minRisk = 80 }: Props) {
  const normalized = query.toLowerCase();
  const filtered = flaggedFraudAccounts.filter((item) => {
    const matchesQuery =
      item.accountId.toLowerCase().includes(normalized) ||
      item.holderName.toLowerCase().includes(normalized) ||
      item.transactionId.toLowerCase().includes(normalized) ||
      item.country.toLowerCase().includes(normalized);

    return (
      item.riskScore >= minRisk &&
      matchesQuery
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
          <CardTitle>Section 1: Flagged Fraud Accounts</CardTitle>
          <CardDescription>Confirmed high-risk accounts and transactions requiring immediate compliance action.</CardDescription>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SearchFilter
            searchParam="fraudSearch"
            pageParam="fraudPage"
            placeholder="Search account, holder, transaction or route"
            defaultValue={query}
          />
          <RiskSliderFilter min={70} max={99} queryParam="fraudMinRisk" minValue={minRisk} label="Minimum Risk Score" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        {paginated.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyState
              title="No flagged fraud accounts"
              description="Try broadening your filters or wait for new AML detections to appear."
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Account Holder Name</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((account) => (
                  <TableRow key={account.transactionId}>
                    <TableCell className="font-semibold text-slate-800">{account.accountId}</TableCell>
                    <TableCell>{account.holderName}</TableCell>
                    <TableCell>{account.transactionId}</TableCell>
                    <TableCell>${account.amount.toLocaleString()}</TableCell>
                    <TableCell>{account.country}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-rose-600">{account.riskScore}/100</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="fraud">High Fraud Risk</Badge>
                    </TableCell>
                    <TableCell className="min-w-[560px]">
                      <FraudRowActions account={account} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationControls pageParam="fraudPage" currentPage={currentPage} totalPages={totalPages} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
