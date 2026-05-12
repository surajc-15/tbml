import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchFilter } from "@/components/ui/search-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { SuspiciousRowActions } from "@/components/dashboard/suspicious-row-actions";
import type { SuspiciousTransaction } from "@/types/aml";
import { getBankCode, transactionInvolvesBank } from "@/lib/bank-utils";

type Props = {
  userRole?: string;
  userBank?: string;
  query?: string;
  page?: number;
};

const PAGE_SIZE = 4;

type AuditRow = {
  transactionId: string;
  senderAccount: string | null;
  receiverAccount: string | null;
  amount: unknown;
  verdict: string;
  actionTaken: string | null;
  strMetadata: unknown;
  loggedAt: Date;
};

const toText = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value.trim() : null);

const toMetadataRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
};

const parseReasons = (value: unknown): string[] => {
  const metadata = toMetadataRecord(value);
  const reasons = metadata.reasons_for_flagging;

  if (Array.isArray(reasons)) {
    return reasons.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
  }

  if (typeof reasons === "string" && reasons.trim()) {
    return [reasons.trim()];
  }

  return [];
};

const mapAuditRowToSuspiciousTransaction = (row: AuditRow): SuspiciousTransaction => {
  const metadata = toMetadataRecord(row.strMetadata);
  const reasons = parseReasons(row.strMetadata);
  const sender = toText(row.senderAccount) ?? "Unknown Sender";
  const receiver = toText(row.receiverAccount) ?? "Unknown Receiver";
  const commodity = toText((metadata as Record<string, unknown>).commodity as unknown) ?? "N/A";

  return {
    transactionId: row.transactionId,
    sender,
    receiver,
    originatingBank: "Originating Bank",
    originatingBankEmail: toText(metadata.originatingBankEmail) ?? undefined,
    amount: Number(row.amount),
    tradeType: toText(metadata.tradeType) ?? toText(row.actionTaken) ?? "Trade transfer",
    suspicionReason: reasons[0] ?? toText(row.actionTaken) ?? "Transaction flagged for review.",
    riskLevel: "medium",
    status: "suspicious",
    commodity,
    senderAccount: sender,
    receiverAccount: receiver,
  };
};

export async function SuspiciousTransactionsTable({ userRole, userBank = "", query = "", page = 1 }: Props) {
  const normalized = query.toLowerCase();
  const userBankCode = getBankCode(userBank);
  let rows: AuditRow[] = [];

  try {
    rows = (await prisma.aml_audit_log.findMany({
      where: {
        verdict: {
          // use WATCHLIST as the DB verdict for suspicious-like records
          equals: "WATCHLIST",
          mode: "insensitive",
        },
      },
      orderBy: {
        loggedAt: "desc",
      },
    })) as AuditRow[];
  } catch {
    rows = [];
  }

  const sourceTransactions = rows.map(mapAuditRowToSuspiciousTransaction);

  // Filter by bank if userBank is provided (for bank users)
  const bankFiltered = userBankCode
    ? sourceTransactions.filter((item) =>
        transactionInvolvesBank(
          item.senderAccount || item.sender,
          item.receiverAccount || item.receiver,
          userBankCode
        )
      )
    : sourceTransactions;

  const filtered = bankFiltered.filter((item) => {
    return (
      item.transactionId.toLowerCase().includes(normalized) ||
      item.sender.toLowerCase().includes(normalized) ||
      item.receiver.toLowerCase().includes(normalized) ||
      item.tradeType.toLowerCase().includes(normalized)
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
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Trade Type</TableHead>
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
                      <TableCell>{txn.commodity}</TableCell>
                      <TableCell>{txn.tradeType}</TableCell>
                      <TableCell className="min-w-[640px]">
                        <SuspiciousRowActions transaction={txn} userRole={userRole} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <PaginationControls pageParam="suspiciousPage" currentPage={currentPage} totalPages={totalPages} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
