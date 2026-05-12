import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { RiskSliderFilter } from "@/components/ui/risk-slider-filter";
import { SearchFilter } from "@/components/ui/search-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FraudRowActions } from "@/components/dashboard/fraud-row-actions";
import { prisma } from "@/lib/prisma";
import { getBankCode, transactionInvolvesBank } from "@/lib/bank-utils";
import type { FraudAccount } from "@/types/aml";

type Props = {
  userRole?: string;
  userBank?: string;
  query?: string;
  page?: number;
  minRisk?: number;
};

const PAGE_SIZE = 4;

type AuditRow = {
  transactionId: string;
  senderAccount: string | null;
  receiverAccount: string | null;
  amount: unknown;
  verdict: string;
  confidenceScore: unknown;
  strMetadata: unknown;
  actionTaken: string | null;
  loggedAt: Date;
  strReport?: {
    id: number;
  } | null;
};

const defaultIndicators = ["Unusual transaction pattern detected"];

const toText = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value.trim() : null);

const parseReasonsFromMetadata = (metadata: unknown): string[] => {
  if (!metadata || typeof metadata !== "object") {
    return [];
  }

  const record = metadata as Record<string, unknown>;
  const reasons = record.reasons_for_flagging;

  if (Array.isArray(reasons)) {
    return reasons
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof reasons === "string" && reasons.trim()) {
    return [reasons.trim()];
  }

  return [];
};

const toMetadataRecord = (metadata: unknown): Record<string, unknown> => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }
  return metadata as Record<string, unknown>;
};

const mapAuditRowToFraudAccount = (row: AuditRow): FraudAccount => {
  const metadata = toMetadataRecord(row.strMetadata);
  const reasons = parseReasonsFromMetadata(row.strMetadata);
  const sender = toText(row.senderAccount) ?? "Unknown Sender";
  const receiver = toText(row.receiverAccount) ?? "Unknown Receiver";
  const score = Number(row.confidenceScore);
  const commodity = toText((metadata as Record<string, unknown>).commodity as unknown) ?? "N/A";

  return {
    accountId: sender,
    holderName: sender,
    originatingBank: "Originating Bank",
    originatingBankEmail: toText((metadata as Record<string, unknown>).originatingBankEmail) ?? undefined,
    transactionId: row.transactionId,
    amount: Number(row.amount),
    country: `${sender} -> ${receiver}`,
    riskScore: Number.isFinite(score) ? score : 0,
    riskIndicators: reasons.length > 0 ? reasons : defaultIndicators,
    tradeDetails: toText(row.actionTaken) ?? "AML audit log entry under review.",
    strMetadata: metadata,
    status: "high",
    senderAccount: sender,
    receiverAccount: receiver,
    commodity,
    hasStrReport: Boolean(row.strReport),
  };
};

export async function FlaggedFraudTable({ userRole, userBank = "", query = "", page = 1, minRisk = 80 }: Props) {
  const normalized = query.trim().toLowerCase();
  const isAdmin = userRole === "ADMIN";
  const userBankCode = getBankCode(userBank);

  let rows: AuditRow[] = [];
  try {
    // Fetch fraud audit logs and include STR report relation so we can decide in UI
    rows = (await prisma.aml_audit_log.findMany({
      where: {
        verdict: {
          equals: "FRAUD",
          mode: "insensitive",
        },
      },
      include: {
        strReport: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        loggedAt: "desc",
      },
    })) as AuditRow[];
  } catch {
    rows = [];
  }
  // Log raw rows fetched from DB for troubleshooting admin visibility
  try {
    console.log("FlaggedFraudTable: fetched rows count=", rows.length);
    console.log(
      "FlaggedFraudTable: transactions=",
      rows.map((r) => ({ transactionId: r.transactionId, strReport: Boolean(r.strReport) })),
    );
  } catch (err) {
    console.error("FlaggedFraudTable: unable to log fetched rows", err);
  }
  let sourceAccounts = rows.map(mapAuditRowToFraudAccount);

  // Admin: filter client-side to only show rows with STR reports (handles cases where relation wasn't returned as expected)
  if (isAdmin) {
    sourceAccounts = sourceAccounts.filter((a) => Boolean(a.hasStrReport));
  }

  // Debug logging: show bank matching details for each row (safe after sourceAccounts created)
  try {
    console.log("FlaggedFraudTable: userBank=", userBank, "userBankCode=", userBankCode, "isAdmin=", isAdmin);
    console.log("FlaggedFraudTable: sourceAccounts.count=", sourceAccounts.length);
    sourceAccounts.forEach((acct) => {
      const senderCode = getBankCode((acct as any).senderAccount || acct.accountId);
      const receiverCode = getBankCode((acct as any).receiverAccount || "");
      const involves = transactionInvolvesBank(
        (acct as any).senderAccount || acct.accountId,
        (acct as any).receiverAccount || "",
        userBankCode,
      );
      console.log(
        `fraud-row: ${acct.transactionId} sender=${acct.senderAccount} senderCode=${senderCode} receiver=${acct.receiverAccount} receiverCode=${receiverCode} involves=${involves} hasStrReport=${Boolean(acct.hasStrReport)} riskScore=${acct.riskScore}`,
      );
    });
  } catch (err) {
    console.error("FlaggedFraudTable: debug logging failed", err);
  }

  // Filter by bank for bank users
  const bankFiltered = isAdmin
    ? sourceAccounts
    : sourceAccounts.filter(
        (account) =>
          transactionInvolvesBank(
            (account as any).senderAccount || account.accountId,
            (account as any).receiverAccount || "",
            userBankCode
          )
      );

  // Log filtering outcomes
  try {
    console.log("FlaggedFraudTable: afterAdminFilter.count=", isAdmin ? sourceAccounts.length : 'n/a');
    console.log("FlaggedFraudTable: afterBankFilter.count=", bankFiltered.length);
  } catch (err) {
    console.error("FlaggedFraudTable: unable to log filter counts", err);
  }

  const filtered = bankFiltered.filter((account) => {
    const matchesRisk = account.riskScore >= minRisk;
    // log each account's risk match for debugging
    try {
      console.log(`FlaggedFraudTable: riskCheck ${account.transactionId} risk=${account.riskScore} meetsMin=${matchesRisk} minRisk=${minRisk}`);
    } catch {}
    if (!normalized) {
      return matchesRisk;
    }

    const matchesQuery =
      account.transactionId.toLowerCase().includes(normalized) ||
      account.accountId.toLowerCase().includes(normalized) ||
      account.holderName.toLowerCase().includes(normalized) ||
      account.tradeDetails.toLowerCase().includes(normalized) ||
      account.riskIndicators.some((reason) => reason.toLowerCase().includes(normalized));

    return matchesRisk && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  try {
    console.log("FlaggedFraudTable: finalCounts -> filtered=", filtered.length, "paginated=", paginated.length, "currentPage=", currentPage, "totalPages=", totalPages);
    console.log("FlaggedFraudTable: filteredTransactions=", filtered.map((f) => ({ id: f.transactionId, risk: f.riskScore, hasStrReport: f.hasStrReport })));
  } catch (err) {
    console.error("FlaggedFraudTable: unable to log final counts", err);
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div>
          <CardTitle>
            {isAdmin ? "Section 1: Fraud Transactions" : "Section 1: Fraud Transactions"}
          </CardTitle>
          <CardDescription>
            {isAdmin
              ? "Transactions with a fraud verdict requiring immediate compliance action."
              : "Fraud transactions originating from or received by your bank."}
          </CardDescription>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SearchFilter
            searchParam="fraudSearch"
            pageParam="fraudPage"
            placeholder="Search transaction id, account, or reason"
            defaultValue={query}
          />
          <RiskSliderFilter min={70} max={99} queryParam="fraudMinRisk" minValue={minRisk} label="Minimum Risk Score" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        {paginated.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyState
              title={isAdmin ? "No fraud transactions" : "No fraud transactions"}
              description="Try broadening your filters or wait for new AML audit logs to appear."
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
                    <TableHead>Score</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((account) => {
                    return (
                      <TableRow key={account.transactionId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{account.transactionId}</span>
                            {account.hasStrReport && <Badge variant="legitimate">STR</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{account.senderAccount}</TableCell>
                        <TableCell>{account.receiverAccount}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {(() => {
                            const score = Number(account.riskScore || 0);
                            const variant = score >= 90 ? "fraud" : score >= 80 ? "suspicious" : score >= 60 ? "legitimate" : "neutral";
                            return <Badge variant={variant as any}>{score.toFixed(2)}</Badge>;
                          })()}
                        </TableCell>
                        <TableCell>${Number(account.amount).toLocaleString()}</TableCell>
                        <TableCell>{account.commodity}</TableCell>
                        <TableCell className="min-w-[560px]">
                          <FraudRowActions account={account} userRole={userRole} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <PaginationControls pageParam="fraudPage" currentPage={currentPage} totalPages={totalPages} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
