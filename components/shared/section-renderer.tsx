import { renderSection } from "@/lib/sections/registry";
import { validateBlocks } from "@/lib/sections/schemas";

/**
 * Renders CMS page blocks through the section registry.
 * Invalid blocks are skipped in production (never crash a client's page);
 * in development they render a visible error so editors catch them early.
 */
export function SectionRenderer({ blocks }: { blocks: unknown }) {
  const { valid, errors } = validateBlocks(blocks);

  return (
    <>
      {valid.map((block, index) => (
        <div key={index}>{renderSection(block.type, block.props)}</div>
      ))}
      {process.env.NODE_ENV !== "production" && errors.length > 0 ? (
        <div className="border-destructive bg-destructive/10 text-destructive mx-auto my-8 max-w-2xl rounded-md border p-4 text-sm">
          <p className="font-semibold">Invalid section blocks (visible in development only):</p>
          <ul className="mt-2 list-inside list-disc">
            {errors.map((error) => (
              <li key={`${error.index}-${error.message}`}>
                Block {error.index + 1}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
