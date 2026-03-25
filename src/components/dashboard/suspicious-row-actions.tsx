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

export function SuspiciousRowActions({ transaction }: { transaction: SuspiciousTransaction }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="w-full justify-center">Notify Account Holder</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notify Account Holder</DialogTitle>
            <DialogDescription>{transaction.transactionId} • {transaction.sender}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => {
                toast.success(`Email notification queued for ${transaction.sender}.`);
                setOpen(false);
              }}
            >
              Send Email Notification
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
        onClick={() => toast.success("Marked as legitimate.")}
      >
        Mark as Legitimate
      </Button>
      <Button
        size="sm"
        className="w-full justify-center"
        variant="destructive"
        onClick={() => toast.warning("Transaction escalated to fraud queue.")}
      >
        Escalate to Fraud
      </Button>
    </div>
  );
}
