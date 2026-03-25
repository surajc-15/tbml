import { NextResponse } from "next/server";

type Payload = {
  accountHolder: string;
  transactionId: string;
  amount: number;
  countryRoute: string;
  riskIndicators: string[];
  tradeDetails: string;
};

type StructuredReport = {
  executiveSummary: string;
  transactionDetails: string;
  riskIndicators: string;
  analyticalInsights: string;
  recommendation: string;
  professionalNotice: string;
};

const cleanLine = (value: string): string => value.replace(/\s+/g, " ").trim();

const toSection = (title: string, lines: string[]): string => {
  const normalizedLines = lines
    .map((line) => cleanLine(line))
    .filter(Boolean)
    .map((line) => `- ${line}`);

  return [title, ...normalizedLines].join("\n");
};

const fallbackReport = (payload: Payload): StructuredReport => ({
  executiveSummary: toSection("Summary", [
    `${payload.accountHolder} has been flagged for enhanced AML review.`,
    `Transaction ${payload.transactionId} shows elevated TBML indicators on the ${payload.countryRoute} route.`,
    "Preliminary analysis indicates a materially elevated risk of trade-based laundering typologies.",
    "Case should be treated as high priority pending verification.",
  ]),
  transactionDetails: toSection("Transaction Details", [
    `Transaction ID: ${payload.transactionId}`,
    `Amount: USD ${payload.amount.toLocaleString()}`,
    `Account Holder: ${payload.accountHolder}`,
    `Route: ${payload.countryRoute}`,
    `Trade narrative: ${payload.tradeDetails}`,
    "Current case status: Under enhanced due diligence review.",
  ]),
  riskIndicators: toSection("Risk Indicators", [
    `Indicators observed: ${payload.riskIndicators.join(", ")}.`,
    "Behavioral profile deviates from expected transactional baseline.",
    "Pattern indicates inconsistency with expected account behavior.",
    "Cross-border route and documentation profile warrant escalation.",
  ]),
  analyticalInsights: toSection("Analytical Insights", [
    "Pattern-level review suggests intentional complexity in transaction flow design.",
    "Amount profile and routing behavior are consistent with layering and obfuscation concerns.",
    "Counterparty and documentation context require source-of-funds and source-of-wealth substantiation.",
    "Risk weighting remains elevated until documentary and counterpart validations are completed.",
  ]),
  recommendation: toSection("Recommended Actions", [
    "Escalate to compliance operations for immediate case review.",
    "Maintain account restrictions until documentary verification is complete.",
    "Request supporting trade documents from originating bank and counterparties.",
    "Prepare and file STR with the relevant regulatory authority.",
  ]),
  professionalNotice: toSection("Professional Notice", [
    "This report is generated for internal AML investigation support and regulatory workflow readiness.",
    "Conclusions are preliminary and subject to additional documentary review and inter-bank clarification.",
    "Distribution must remain restricted to authorized compliance and fraud operations personnel.",
    "Any external disclosure must follow applicable policy, legal hold, and jurisdictional reporting requirements.",
  ]),
});

const normalizeModelSection = (title: string, value: unknown, fallback: string): string => {
  if (typeof value !== "string") {
    return fallback;
  }

  const lines = value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return fallback;
  }

  return toSection(title, lines);
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;

    if (!payload.accountHolder || !payload.transactionId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const prompt = `Generate a Suspicious Transaction Report from the data below.

  Account Holder: ${payload.accountHolder}
  Transaction ID: ${payload.transactionId}
  Amount: ${payload.amount}
  Country Route: ${payload.countryRoute}
  Risk Indicators: ${payload.riskIndicators.join(", ")}
  Trade Details: ${payload.tradeDetails}

  Return JSON only with keys executiveSummary, transactionDetails, riskIndicators, analyticalInsights, recommendation, professionalNotice.
  Each key must be a plain string with line-separated statements (no markdown heading, no extra keys, no code fences).
  Keep tone formal, regulatory-compliant, and suitable for a professional compliance notice.
  Aim for a detailed report length equivalent to roughly 1-2 pages when combined across all sections.`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ report: fallbackReport(payload), source: "fallback" });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an AML reporting assistant. Return strict JSON with exactly six string fields: executiveSummary, transactionDetails, riskIndicators, analyticalInsights, recommendation, professionalNotice.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return NextResponse.json(
        {
          error: "Groq request failed",
          detail: errorText,
          report: fallbackReport(payload),
        },
        { status: 200 },
      );
    }

    const completion = (await groqResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ report: fallbackReport(payload), source: "fallback-empty" });
    }

    const parsed = JSON.parse(content) as Partial<StructuredReport>;
    const fallback = fallbackReport(payload);

    return NextResponse.json({
      report: {
        executiveSummary: normalizeModelSection("Summary", parsed.executiveSummary, fallback.executiveSummary),
        transactionDetails: normalizeModelSection("Transaction Details", parsed.transactionDetails, fallback.transactionDetails),
        riskIndicators: normalizeModelSection("Risk Indicators", parsed.riskIndicators, fallback.riskIndicators),
        analyticalInsights: normalizeModelSection("Analytical Insights", parsed.analyticalInsights, fallback.analyticalInsights),
        recommendation: normalizeModelSection("Recommended Actions", parsed.recommendation, fallback.recommendation),
        professionalNotice: normalizeModelSection("Professional Notice", parsed.professionalNotice, fallback.professionalNotice),
      },
      source: "groq",
    });
  } catch {
    return NextResponse.json({ error: "Unable to generate report." }, { status: 500 });
  }
}
