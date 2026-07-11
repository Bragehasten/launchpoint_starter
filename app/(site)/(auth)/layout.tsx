import { Container } from "@/components/shared/container";

/** Centered card layout shared by all auth pages. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center py-12">
      <div className="w-full max-w-sm">{children}</div>
    </Container>
  );
}
