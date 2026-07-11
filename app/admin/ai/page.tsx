import type { Metadata } from "next";

import { AiStudio, type TaskMeta } from "@/components/admin/ai-studio";
import { aiEnabled } from "@/lib/ai/client";
import { aiTasks, aiTaskKeys } from "@/lib/ai/tasks";
import { requireRole } from "@/lib/auth";
import { isCapabilityEnabled } from "@/lib/capabilities";

export const metadata: Metadata = { title: "AI Studio" };

export default async function AdminAiPage() {
  await requireRole("editor");

  const tasks: TaskMeta[] = aiTaskKeys.map((key) => ({
    key,
    label: aiTasks[key].label,
    description: aiTasks[key].description,
    topicPlaceholder: aiTasks[key].topicPlaceholder,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">AI Studio</h1>
        <p className="text-muted-foreground text-sm">
          Content generation with the business context baked in. Everything is a draft — a human
          publishes.
        </p>
      </div>
      {aiEnabled() ? (
        <AiStudio tasks={tasks} serviceAreasEnabled={isCapabilityEnabled("serviceAreas")} />
      ) : (
        <p className="text-muted-foreground rounded-md border border-dashed p-12 text-center text-sm">
          AI is not configured. Add <code className="font-mono">ANTHROPIC_API_KEY</code> to{" "}
          <code className="font-mono">.env.local</code> (console.anthropic.com → API keys) and
          restart the dev server.
        </p>
      )}
    </div>
  );
}
