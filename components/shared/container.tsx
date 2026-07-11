import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

/** Horizontally centered content wrapper with responsive padding. */
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />
  );
}

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Render as a different semantic element. */
  as?: "section" | "div" | "header" | "footer" | "main" | "article" | "aside";
};

/** Vertical rhythm wrapper for page sections. */
export function Section({ className, as: Comp = "section", ...props }: SectionProps) {
  return <Comp className={cn("section-space", className)} {...props} />;
}
