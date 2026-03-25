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
  recommendation: string;
};

const fallbackReport = (payload: Payload): StructuredReport => ({
  executiveSummary: `This transaction has been flagged for enhanced AML review due to elevated TBML indicators and cross-border routing anomalies involving ${payload.accountHolder}.`,
  transactionDetails: `Transaction ${payload.transactionId} with value USD ${payload.amount.toLocaleString()} was routed through ${payload.countryRoute}. Trade narrative: ${payload.tradeDetails}`,
  riskIndicators: `Observed indicators include: ${payload.riskIndicators.join(", ")}. Pattern analysis suggests material inconsistency with expected client trade behavior.`,
  recommendation:
    "Proceed with immediate escalation to compliance operations, maintain account restrictions pending documentary verification, and file STR to relevant regulatory authority.",
});

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;

    if (!payload.accountHolder || !payload.transactionId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const prompt = `You are an AML compliance officer. Generate a Suspicious Transaction Report using the following data:\nAccount Holder: ${payload.accountHolder}\nTransaction ID: ${payload.transactionId}\nAmount: ${payload.amount}\nCountry Route: ${payload.countryRoute}\nRisk Indicators: ${payload.riskIndicators.join(", ")}\nTrade Details: ${payload.tradeDetails}\nMake it formal, regulatory compliant and structured.`;

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
              "Return valid JSON with keys executiveSummary, transactionDetails, riskIndicators, recommendation. Keep language formal and compliance-oriented.",
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

    const parsed = JSON.parse(content) as StructuredReport;

    return NextResponse.json({
      report: {
        executiveSummary: parsed.executiveSummary ?? fallbackReport(payload).executiveSummary,
        transactionDetails: parsed.transactionDetails ?? fallbackReport(payload).transactionDetails,
        riskIndicators: parsed.riskIndicators ?? fallbackReport(payload).riskIndicators,
        recommendation: parsed.recommendation ?? fallbackReport(payload).recommendation,
      },
      source: "groq",
    });
  } catch {
    return NextResponse.json({ error: "Unable to generate report." }, { status: 500 });
  }
}
