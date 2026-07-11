import type { Metadata } from "next";

import { PageEditor } from "@/components/admin/page-editor";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = { title: "New page" };

export default async function NewCmsPage() {
  await requireRole("editor");
  return <PageEditor page={null} />;
}
