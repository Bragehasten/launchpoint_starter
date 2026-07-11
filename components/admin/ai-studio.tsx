"use client";

import * as React from "react";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { createServiceAreaDraft, runAiTask } from "@/actions/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * AI Studio: every content preset in one place. Output is text the editor
 * copies into the right field — deliberately not auto-inserted, so a human
 * reads everything before it ships. (Exception: area drafts, which land as
 * INACTIVE rows in Service Areas.)
 */

export type TaskMeta = {
  key: string;
  label: string;
  description: string;
  topicPlaceholder: string;
};

export function AiStudio({
  tasks,
  serviceAreasEnabled,
}: {
  tasks: TaskMeta[];
  serviceAreasEnabled: boolean;
}) {
  const [taskKey, setTaskKey] = React.useState(tasks[0]?.key ?? "");
  const [topic, setTopic] = React.useState("");
  const [extra, setExtra] = React.useState("");
  const [result, setResult] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [copied, setCopied] = React.useState(false);

  const task = tasks.find((t) => t.key === taskKey) ?? tasks[0];

  function onGenerate() {
    startTransition(async () => {
      setResult("");
      const response = await runAiTask({ task: taskKey, topic, extra: extra || undefined });
      if (response.success) {
        setResult(response.text);
      } else {
        toast.error(response.message);
      }
    });
  }

  async function onCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="heading">Generate</CardTitle>
          <CardDescription>Drafts, not gospel — read everything before it ships.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ai-task">Task</Label>
            <select
              id="ai-task"
              value={taskKey}
              onChange={(e) => {
                setTaskKey(e.target.value);
                setResult("");
              }}
              className="border-input bg-background focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            >
              {tasks.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
            {task ? <p className="text-muted-foreground text-xs">{task.description}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ai-topic">Input</Label>
            <Textarea
              id="ai-topic"
              rows={4}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={task?.topicPlaceholder}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ai-extra">Facts / notes (optional)</Label>
            <Textarea
              id="ai-extra"
              rows={2}
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="True details to anchor the copy — the model is told to invent nothing."
            />
          </div>
          <Button onClick={onGenerate} disabled={pending || !topic.trim()} className="w-fit">
            {pending ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Generate
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="heading">Result</CardTitle>
          {result ? (
            <Button variant="outline" size="sm" onClick={onCopy}>
              {copied ? <Check /> : <Copy />}
              {copied ? "Copied" : "Copy"}
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {result ? (
            <pre className="max-h-[32rem] overflow-auto text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </pre>
          ) : (
            <p className="text-muted-foreground rounded-md border border-dashed p-10 text-center text-sm">
              {pending ? "Generating…" : "Output appears here."}
            </p>
          )}
        </CardContent>
      </Card>

      {serviceAreasEnabled ? <AreaDraftPanel /> : null}
    </div>
  );
}

/** One-click service-area drafts: generated copy lands as an inactive row. */
function AreaDraftPanel() {
  const [name, setName] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  function onCreate() {
    startTransition(async () => {
      const result = await createServiceAreaDraft({
        name,
        region: region || undefined,
        notes: notes || undefined,
      });
      if (result.success) {
        toast.success(`Draft created (inactive): review it under Service Areas → ${result.slug}`);
        setName("");
        setNotes("");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="heading">Draft a service-area page</CardTitle>
        <CardDescription>
          Generates unique intro, body, and FAQs, saved as an <strong>inactive</strong> area —
          review and publish in Service Areas. Feed it true local facts for copy that ranks.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="area-name">Area name</Label>
            <Input
              id="area-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jupiter"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="area-region">State / region</Label>
            <Input
              id="area-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="FL"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="area-notes">True local facts</Label>
          <Textarea
            id="area-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. mostly metal roof conversions near the inlet; 30-minute response from the Stuart office; we did the Maplewood HOA"
          />
        </div>
        <Button onClick={onCreate} disabled={pending || !name.trim()} className="w-fit">
          {pending ? <Loader2 className="animate-spin" /> : <Sparkles />}
          Create draft
        </Button>
      </CardContent>
    </Card>
  );
}
