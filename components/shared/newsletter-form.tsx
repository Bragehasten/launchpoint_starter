"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { subscribeNewsletter } from "@/actions/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations/forms";

export function NewsletterForm() {
  const [pending, startTransition] = React.useTransition();
  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });
  const error = form.formState.errors.email?.message;

  function onSubmit(values: NewsletterInput) {
    startTransition(async () => {
      const result = await subscribeNewsletter(values);
      if (result.success) {
        toast.success(result.message ?? "Subscribed!");
        form.reset();
      } else {
        toast.error(result.message ?? "Something went wrong.");
      }
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2" noValidate>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="you@example.com"
            aria-label="Email address"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "newsletter-error" : undefined}
            autoComplete="email"
            className="max-w-60"
            {...form.register("email")}
          />
          <Button type="submit" variant="outline" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : null}
            Subscribe
          </Button>
        </div>
        {error ? (
          <p id="newsletter-error" className="text-destructive text-sm">
            {error}
          </p>
        ) : null}
      </form>
    </FormProvider>
  );
}
