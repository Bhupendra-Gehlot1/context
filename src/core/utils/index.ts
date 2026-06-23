import type { Message, ConversationSummary, PresenceUser } from "../models";

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

// ── Question detection ───────────────────────────────────────────────────────

const QUESTION_STARTERS = [
  "can ",
  "could ",
  "should ",
  "would ",
  "anyone ",
  "does ",
  "will ",
  "is ",
  "are ",
  "has ",
  "have ",
  "do ",
  "when ",
  "where ",
  "why ",
  "how ",
  "what ",
];

export function detectQuestion(content: string): boolean {
  const lower = content.trim().toLowerCase();
  if (lower.includes("?")) return true;
  return QUESTION_STARTERS.some((starter) => lower.startsWith(starter));
}

// ── Keyword extraction ───────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "this",
  "that",
  "it",
  "its",
  "i",
  "we",
  "you",
  "he",
  "she",
  "they",
  "my",
  "our",
  "your",
  "their",
  "just",
  "not",
  "also",
  "so",
  "if",
  "about",
  "up",
  "as",
  "into",
  "then",
  "than",
  "too",
  "very",
  "any",
  "all",
  "some",
  "more",
  "no",
]);

export function extractKeywords(messages: Message[]): string[] {
  const wordFreq: Record<string, number> = {};

  messages.forEach(({ content }) => {
    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

    words.forEach((w) => {
      wordFreq[w] = (wordFreq[w] ?? 0) + 1;
    });
  });

  return Object.entries(wordFreq)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([word]) => word);
}

// ── Topic clustering ─────────────────────────────────────────────────────────

const TOPIC_SEEDS: Record<string, string[]> = {
  Deployment: [
    "deploy",
    "deployment",
    "release",
    "ship",
    "production",
    "staging",
    "pipeline",
    "ci",
    "cd",
  ],
  "Bug Fixes": [
    "bug",
    "fix",
    "error",
    "issue",
    "broken",
    "crash",
    "exception",
    "null",
    "undefined",
  ],
  "Code Review": [
    "review",
    "pr",
    "pull request",
    "merge",
    "branch",
    "commit",
    "diff",
  ],
  API: [
    "api",
    "endpoint",
    "request",
    "response",
    "rest",
    "graphql",
    "fetch",
    "axios",
  ],
  Frontend: [
    "frontend",
    "ui",
    "component",
    "react",
    "css",
    "tailwind",
    "style",
    "design",
  ],
  Backend: [
    "backend",
    "server",
    "database",
    "db",
    "query",
    "migration",
    "schema",
  ],
  Testing: [
    "test",
    "tests",
    "testing",
    "spec",
    "jest",
    "vitest",
    "coverage",
    "unit",
    "e2e",
  ],
  Performance: [
    "performance",
    "slow",
    "fast",
    "optimize",
    "cache",
    "latency",
    "load",
  ],
  Meeting: [
    "meeting",
    "standup",
    "sync",
    "call",
    "demo",
    "presentation",
    "discuss",
  ],
};

export function detectTopics(messages: Message[]): string[] {
  const allText = messages.map((m) => m.content.toLowerCase()).join(" ");
  const found: string[] = [];

  for (const [topic, seeds] of Object.entries(TOPIC_SEEDS)) {
    if (seeds.some((seed) => allText.includes(seed))) {
      found.push(topic);
    }
  }

  return found;
}

export function buildActivityLines(messages: Message[]): string[] {
  const byUser: Record<string, Message[]> = {};
  messages.forEach((m) => {
    if (!byUser[m.user_name]) byUser[m.user_name] = [];
    byUser[m.user_name].push(m);
  });

  return Object.entries(byUser)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 5)
    .map(([user, msgs]) => {
      const keywords = extractKeywords(msgs).slice(0, 2);
      const about = keywords.length > 0 ? ` about ${keywords.join(", ")}` : "";
      return `${user} sent ${msgs.length} message${msgs.length !== 1 ? "s" : ""}${about}`;
    });
}

export function buildSummary(messages: Message[]): ConversationSummary {
  if (messages.length === 0) {
    return {
      participants: [],
      topics: [],
      recentActivity: [],
      openQuestions: [],
      messageCount: 0,
    };
  }

  const recent = messages.slice(-50);
  const participants = [...new Set(recent.map((m) => m.user_name))];
  const topics = detectTopics(recent);
  const recentActivity = buildActivityLines(recent);
  const openQuestions = recent
    .filter((m) => detectQuestion(m.content))
    .slice(-5)
    .map((m) => m.content.trim());

  return {
    participants,
    topics,
    recentActivity,
    openQuestions,
    messageCount: recent.length,
  };
}

export interface MessageGroup {
  user_name: string;
  messages: Message[];
  firstTimestamp: string;
}

export function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  messages.forEach((msg) => {
    const last = groups[groups.length - 1];
    const GAP_MINUTES = 3;

    if (
      last &&
      last.user_name === msg.user_name &&
      new Date(msg.created_at).getTime() -
        new Date(last.messages[last.messages.length - 1].created_at).getTime() <
        GAP_MINUTES * 60 * 1000
    ) {
      last.messages.push(msg);
    } else {
      groups.push({
        user_name: msg.user_name,
        messages: [msg],
        firstTimestamp: msg.created_at,
      });
    }
  });

  return groups;
}

const AVATAR_COLORS = [
  "#6c63ff",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function parsePresenceUsers(
  state: Record<string, unknown[]>,
): PresenceUser[] {
  return Object.entries(state)
    .map(([userId, presences]) => {
      if (!presences?.length) return null;
      const latest = presences[presences.length - 1] as Record<string, unknown>;
      const user_name = latest["user_name"] as string | undefined;
      if (!user_name) return null;
      return {
        user_id: userId,
        user_name,
        online_at: (latest["online_at"] as string) ?? new Date().toISOString(),
      };
    })
    .filter((u): u is NonNullable<typeof u> => u !== null);
}

export function generateId(): string {
  return crypto.randomUUID();
}
