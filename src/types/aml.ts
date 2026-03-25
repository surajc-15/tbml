export type FraudStatus = "fraud" | "suspicious" | "legitimate";

export type FraudAccount = {
  accountId: string;
  holderName: string;
  transactionId: string;
  amount: number;
  country: string;
  riskScore: number;
  riskIndicators: string[];
  tradeDetails: string;
  status: "high";
};

export type SuspiciousTransaction = {
  transactionId: string;
  sender: string;
  receiver: string;
  amount: number;
  tradeType: string;
  suspicionReason: string;
  riskLevel: "medium";
  status: FraudStatus;
};

export type SimulationMode = "legitimate" | "fraud";

export type SimulationInput = {
  senderAccount: string;
  receiverAccount: string;
  amount: number;
  commodity: string;
  countryRoute: string;
  remarks: string;
};

export type SimulationResult = {
  riskScore: number;
  prediction: "Fraud" | "Suspicious" | "Safe";
  steps: Array<{
    timestamp: string;
    title: string;
    detail: string;
  }>;
};
