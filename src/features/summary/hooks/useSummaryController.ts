import { useMemo } from "react";
import { summaryService } from "../../../core/services/SummaryService";
import type { Message } from "../../../core/models";

export function useSummaryController(messages: Message[]) {
  const summary = useMemo(() => {
    return summaryService.generate(messages);
  }, [messages]);

  return {
    summary,
  };
}
