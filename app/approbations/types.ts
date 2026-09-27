import type { Id } from "@/convex/_generated/dataModel";

export type ApprobationTableRow = {
  _id: Id<"infractions">;
  ruleId: Id<"rules">;
  accusedUserId: string;
  reportedBy: string;
  quantity: number;
  amountCents: number;
  note?: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt: number;

  description: string;
  accusedName: string;
  reporterName: string;

  yesVotes: number;
  noVotes: number;
  requiredApprovals: number;

  currentUserVote: "yes" | "no" | null;
};
