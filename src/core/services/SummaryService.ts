import { buildSummary } from "../utils";
import type { Message, ConversationSummary } from "../models";

export class SummaryService {
  generate(messages: Message[]): ConversationSummary {
    return buildSummary(messages);
  }
}

export const summaryService = new SummaryService();
