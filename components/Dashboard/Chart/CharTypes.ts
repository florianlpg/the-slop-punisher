export type TimeRange = "today" | "7d" | "30d" | "90d" | "1y";

export type ChartUser = {
  id: string;
  name: string;
  color: string;
};

export type ChartInfraction = {
  userId: string;
  amountCents: number;
  createdAt: number;
};

export type ChartTransaction = {
  userId: string;
  amountCents: number;
  createdAt: number;
};

export type ChartData = {
  users: ChartUser[];
  infractions: ChartInfraction[];
  transactions: ChartTransaction[];
};

export type ChartPoint = {
  date: string;
  [userId: string]: string | number;
};

export type ChartAreaInteractiveProps = {
  data: ChartData;
};
