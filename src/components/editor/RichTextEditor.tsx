"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { BackgroundColor } from "@/lib/tiptap/BackgroundColor";
import EditorMenuBar from "./EditorMenuBar";

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    // TipTap SSR/hydration uyarısını önlemek için (Next.js App Router)
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      BackgroundColor,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-200 transition">
      <EditorMenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[160px] p-3 text-sm leading-relaxed focus:outline-none"
      />
    </div>
  );
}

