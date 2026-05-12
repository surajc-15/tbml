"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SuspiciousTransaction } from "@/types/aml";

export function SuspiciousRowActions({ transaction, userRole }: { transaction: SuspiciousTransaction; userRole?: string }) {
  const [open, setOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [alreadyNotified, setAlreadyNotified] = useState(false);

  const notifyOriginatingBank = async () => {
    if (alreadyNotified) {
      toast.info("Inquiry already sent to compliance and originating bank.");
      return;
    }

    try {
      setNotifying(true);
      const response = await fetch("/api/str/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseType: "suspicious", transaction }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error ?? "Failed to send suspicious-case inquiry.");
      }

      setAlreadyNotified(true);
      toast.success("Suspicious inquiry sent to accounts and compliance.");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send suspicious-case inquiry.");
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="w-full justify-center" disabled={alreadyNotified}>
            {alreadyNotified ? "Inquiry Sent" : "Notify Originating Bank"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Suspicious-Case Bank Inquiry</DialogTitle>
            <DialogDescription>{transaction.transactionId} • {transaction.sender}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => void notifyOriginatingBank()}
              disabled={notifying || alreadyNotified}
            >
              {notifying ? "Sending notification..." : alreadyNotified ? "Already Notified" : "Notify Accounts & Compliance"}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                toast.success(`Branch visit scheduler opened for ${transaction.sender}.`);
                setOpen(false);
              }}
            >
              Schedule Branch Visit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        className="w-full justify-center"
        variant="outline"
        onClick={() => toast.info("Document request sent to account holder.")}
      >
        Request Documents
      </Button>
      <Button
        size="sm"
        className="w-full justify-center"
        variant="secondary"
        onClick={async () => {
          try {
                  const res = await fetch("/api/str/mark", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transactionId: transaction.transactionId, verdict: "CLEAN" }),
                  });

                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) throw new Error((data as any).error ?? "Failed to set verdict.");

                  const time = (data?.updated?.loggedAt as string) ?? null;
                  toast.success(time ? `Transaction marked CLEAN at ${new Date(time).toLocaleString()}.` : "Transaction marked CLEAN.");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Unable to mark as CLEAN.");
          }
        }}
      >
        Mark as Legitimate
      </Button>
      <Button
        size="sm"
        className="w-full justify-center"
        variant="destructive"
        onClick={async () => {
          try {
            const res = await fetch("/api/str/mark", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ transactionId: transaction.transactionId, verdict: "FRAUD" }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error((data as any).error ?? "Failed to set verdict.");

            const time = (data?.updated?.loggedAt as string) ?? null;
            toast.success(time ? `Transaction marked FRAUD at ${new Date(time).toLocaleString()} and escalated.` : "Transaction marked FRAUD and escalated.");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Unable to mark as FRAUD.");
          }
        }}
      >
        Escalate to Fraud
      </Button>
    </div>
  );
}
