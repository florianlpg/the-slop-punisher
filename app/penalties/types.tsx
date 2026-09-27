import type { Id } from "@/convex/_generated/dataModel";

export type PenaltyStatus = "pending" | "confirmed" | "rejected";

export type PenaltyUnit =
  | "occurrence"
  | "file"
  | "row"
  | "line"
  | "minute"
  | "custom";

export type PenaltyUser = {
  clerkUserId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
};

export type PenaltyRule = {
  _id: Id<"rules">;
  description: string;
  fineAmountCents: number;
  unit: PenaltyUnit;
  customUnitLabel?: string;
  requiredApprovalsToConfirm: number;
  status: "proposed" | "active" | "rejected" | "archived";
  createdBy: string;
  createdAt: number;
};

export type PenaltyTableRow = {
  id: Id<"infractions">;
  ruleId: Id<"rules">;
  rule: PenaltyRule | null;
  accusedUser: PenaltyUser | null;
  reporterUser: PenaltyUser | null;
  accusedUserId: string;
  reportedBy: string;
  quantity: number;
  amountCents: number;
  note?: string;
  status: PenaltyStatus;
  createdAt: number;
  resolvedAt?: number;
};
