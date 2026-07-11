import { Container, Section } from "@/components/shared/container";
import { SkeletonCardGrid } from "@/components/shared/loading-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-5 w-64" />
        </div>
        <SkeletonCardGrid count={6} />
      </Container>
    </Section>
  );
}
