import { Container, Section } from "@/components/shared/container";
import { SkeletonArticle } from "@/components/shared/loading-skeletons";

export default function BlogPostLoading() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <SkeletonArticle />
      </Container>
    </Section>
  );
}
