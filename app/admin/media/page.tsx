import type { Metadata } from "next";
import Image from "next/image";
import { Trash2 } from "lucide-react";

import { deleteMedia } from "@/actions/cms";
import { MediaUpload } from "@/components/admin/media-upload";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Media" };

export default async function AdminMediaPage() {
  await requireRole("editor");

  const supabase = await createClient();
  const { data: items } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading text-2xl">Media</h1>
        <p className="text-muted-foreground text-sm">
          Images uploaded here are served from Supabase Storage.
        </p>
      </div>

      <MediaUpload />

      {items && items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => {
            const {
              data: { publicUrl },
            } = supabase.storage.from("media").getPublicUrl(item.path);
            return (
              <li key={item.id} className="group relative overflow-hidden rounded-md border">
                <Image
                  src={publicUrl}
                  alt={item.alt ?? ""}
                  width={300}
                  height={200}
                  className="aspect-[3/2] w-full object-cover"
                />
                <div className="flex items-center justify-between gap-2 p-2">
                  <p className="text-muted-foreground truncate text-xs" title={publicUrl}>
                    {item.alt || item.path.split("/").pop()}
                  </p>
                  <form action={deleteMedia}>
                    <input type="hidden" name="path" value={item.path} />
                    <button
                      type="submit"
                      aria-label="Delete image"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground rounded-md border border-dashed p-12 text-center text-sm">
          No media yet. Upload your first image above.
        </p>
      )}
    </div>
  );
}
