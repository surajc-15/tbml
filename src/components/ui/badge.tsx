import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        fraud: "border-rose-200 bg-rose-50 text-rose-700",
        suspicious: "border-amber-200 bg-amber-50 text-amber-700",
        legitimate: "border-emerald-200 bg-emerald-50 text-emerald-700",
        neutral: "border-slate-200 bg-slate-50 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
