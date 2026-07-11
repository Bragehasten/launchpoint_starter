"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { uploadMedia } from "@/actions/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MediaUpload() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [alt, setAlt] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      toast.error("Choose a file first.");
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    formData.set("alt", alt);

    startTransition(async () => {
      const result = await uploadMedia(formData);
      if (result.success) {
        toast.success("Uploaded.");
        setAlt("");
        if (fileRef.current) fileRef.current.value = "";
        router.refresh();
      } else {
        toast.error(result.message ?? "Upload failed.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="media-file" className="text-sm font-medium">
          Image
        </label>
        <Input id="media-file" ref={fileRef} type="file" accept="image/*" className="max-w-xs" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="media-alt" className="text-sm font-medium">
          Alt text
        </label>
        <Input
          id="media-alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Describe the image"
          className="max-w-xs"
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <Upload />}
        Upload
      </Button>
    </form>
  );
}
