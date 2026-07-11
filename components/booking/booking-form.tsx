"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createBooking } from "@/actions/booking";
import { HoneypotField, TextareaField, TextField } from "@/components/shared/form-fields";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email({ error: "Enter a valid email address" }),
  phone: z.string().max(30).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
  company: z.string().max(0).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

type BookingFormProps = {
  /** ISO timestamp of the selected slot. */
  startsAt: string;
  slotLabel: string;
};

export function BookingForm({ startsAt, slotLabel }: BookingFormProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", notes: "", company: "" },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await createBooking({ ...values, startsAt });
      if (!result.success) {
        toast.error(result.message);
        router.refresh();
        return;
      }
      if (result.depositUrl) {
        // Deposit required: hand off to Stripe Checkout.
        window.location.assign(result.depositUrl);
        return;
      }
      toast.success("Booking requested! We'll confirm by email shortly.");
      form.reset();
      router.push("/book?booked=1");
      router.refresh();
    });
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col gap-4"
        noValidate
      >
        <HoneypotField />
        <p className="bg-muted rounded-md px-3 py-2 text-sm font-medium">{slotLabel}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField<FormValues> name="name" label="Name" autoComplete="name" />
          <TextField<FormValues> name="email" label="Email" type="email" autoComplete="email" />
        </div>
        <TextField<FormValues>
          name="phone"
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
        />
        <TextareaField<FormValues> name="notes" label="Notes (optional)" rows={3} />
        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? <Loader2 className="animate-spin" /> : null}
          Confirm booking
        </Button>
      </form>
    </FormProvider>
  );
}
