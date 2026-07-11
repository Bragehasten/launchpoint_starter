"use client";

import * as React from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  /** Initial Tiptap JSON document. */
  initialContent: JSONContent;
  /** Called with the updated document on every change. */
  onChange: (content: JSONContent) => void;
};

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn("size-8", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({ placeholder: "Write something great…" }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getJSON()),
  });

  const setLink = React.useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return <div className="bg-muted h-[350px] animate-pulse rounded-md border" />;
  }

  return (
    <div className="rounded-md border">
      <div
        role="toolbar"
        aria-label="Formatting"
        className="bg-muted/40 flex flex-wrap items-center gap-0.5 border-b p-1"
      >
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolbarButton>
        <ToolbarButton
          label="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </ToolbarButton>
        <ToolbarButton
          label="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code />
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon />
        </ToolbarButton>
        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
            <Undo />
          </ToolbarButton>
          <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
            <Redo />
          </ToolbarButton>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
