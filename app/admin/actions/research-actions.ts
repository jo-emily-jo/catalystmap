"use server";

import Anthropic from "@anthropic-ai/sdk";

// ── Rate limiting (in-memory, per-session, resets on restart) ─────

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_CALLS_PER_HOUR = 5;

function checkRateLimit(sessionId: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = rateLimits.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(sessionId, { count: 1, resetAt: now + 3600_000 });
    return { allowed: true, remaining: MAX_CALLS_PER_HOUR - 1 };
  }

  if (entry.count >= MAX_CALLS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_CALLS_PER_HOUR - entry.count };
}

// ── Types ─────────────────────────────────────────────────────────

export interface ResearchCandidate {
  companyName: string;
  ticker: string;
  exchange: string;
  country: string;
  sector: string;
  relationshipType: string;
  relationshipStrength: string;
  evidenceSummary: string;
  sources: {
    url: string;
    sourceType: string;
    title: string;
  }[];
  hypeRisk: string;
}

export interface ResearchResult {
  candidates: ResearchCandidate[];
  note?: string;
  remaining: number;
  error?: string;
}

// ── Prompt ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a financial research assistant helping a curator at CatalystMap identify publicly traded companies with evidence-based exposure to a given "catalyst company." Your job is to PROPOSE candidates for the curator's review — you do not write anything to the database.

Quality rules:
1. Only suggest companies that are PUBLICLY TRADED on a recognized stock exchange. Never suggest private companies.
2. Never fabricate source URLs. If you cannot recall a specific verifiable URL, write the literal string "url-not-verified" in the url field — do NOT invent plausible-looking URLs.
3. Ground every evidenceSummary claim. If a fact is uncertain, prefix with "Reportedly" or "According to industry analysis" — never state speculation as fact.
4. Prefer sources from the last 24 months unless documenting a foundational long-term relationship.
5. Quality over quantity. If you cannot identify 5 candidates with meaningful evidence, return fewer (minimum 0) and explain why in the optional \`note\` field.
6. Never include the catalyst company itself as a candidate.
7. Prefer named, evidenced relationships (investment, customer, supplier, partnership) over thematic associations. Thematic/speculative entries only when no stronger relationship type fits.
8. hypeRisk heuristic (apply consistently):
   - high: public company's price has risen >100% in last 12 months AND relationship is speculative
   - medium: >50% rise AND relationship is indirect
   - low: otherwise

Output: a single JSON object wrapped in <json>...</json> tags. No prose before or after, no markdown code fences.`;

function buildUserMessage(catalyst: {
  name: string;
  slug: string;
  themes: string;
  country: string;
  isPublic: boolean;
  shortDescription: string;
  thesisMd: string;
}): string {
  return `Research publicly traded companies with evidence-based exposure to this catalyst:

- Name: ${catalyst.name}
- Slug: ${catalyst.slug}
- Themes: ${catalyst.themes}
- Country: ${catalyst.country}
- Public/Private: ${catalyst.isPublic ? "Public" : "Private"}
- Description: ${catalyst.shortDescription}
- Thesis (why this matters now):
${catalyst.thesisMd}

Return candidates as a JSON object inside <json>...</json> tags matching this schema:

<json>
{
  "candidates": [
    {
      "companyName": "Full legal trading name",
      "ticker": "TICKER",
      "exchange": "NYSE|NASDAQ|LSE|KRX|TSE|HKEX|Euronext|XETRA|ASX",
      "country": "ISO 3166-1 alpha-2 code",
      "sector": "GICS sector name",
      "relationshipType": "investment|customer|supplier|partnership|infrastructure|thematic|speculative",
      "relationshipStrength": "direct|indirect|speculative",
      "evidenceSummary": "2–4 sentences. Cite specific facts: revenue %, contract values, investment amounts. Flag uncertainty with 'Reportedly' or 'According to industry analysis'.",
      "sources": [
        {
          "url": "https://real-verified-url OR url-not-verified",
          "sourceType": "sec_filing|earnings_call|official_announcement|reuters|bloomberg|ft|wsj|analyst_report|news_article|blog|community",
          "title": "Descriptive title of the source"
        }
      ],
      "hypeRisk": "low|medium|high"
    }
  ],
  "note": "Optional. Explain if fewer than 5 candidates were identified."
}
</json>`;
}

// ── Action ────────────────────────────────────────────────────────

export async function runResearchAction(
  catalystData: {
    name: string;
    slug: string;
    themes: string;
    country: string;
    isPublic: boolean;
    shortDescription: string;
    thesisMd: string;
  },
  sessionId: string
): Promise<ResearchResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      candidates: [],
      remaining: 0,
      error: "ANTHROPIC_API_KEY not configured",
    };
  }

  const { allowed, remaining } = checkRateLimit(sessionId);
  if (!allowed) {
    return {
      candidates: [],
      remaining: 0,
      error: "Rate limit reached (5 per hour). Try again later.",
    };
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserMessage(catalystData),
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parse JSON from <json>...</json> tags
    const jsonMatch = text.match(/<json>([\s\S]*?)<\/json>/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;

    const parsed = JSON.parse(jsonStr) as {
      candidates: ResearchCandidate[];
      note?: string;
    };

    return {
      candidates: parsed.candidates ?? [],
      note: parsed.note,
      remaining,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "AI research request failed";
    return { candidates: [], remaining, error: message };
  }
}
