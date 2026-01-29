"use client";

import { Editor } from "@tiptap/react";

export default function EditorMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const formattingButtons = [
    {
      name: "B",
      label: "Kalın",
      command: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      name: "I",
      label: "İtalik",
      command: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      name: "U",
      label: "Altı Çizili",
      command: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
  ];

  const bgColors = [
    { name: "Sarı", color: "#ffe600" },
    { name: "Mavi", color: "#2196f3" },
    { name: "Yeşil", color: "#4caf50" },
    { name: "Kırmızı", color: "#f44336" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-2 mb-2 mt-2 text-sm">
      {/* Stil Butonları */}
      {formattingButtons.map((btn) => (
        <button
          key={btn.name}
          aria-label={btn.label}
          type="button"
          onClick={btn.command}
          className={`flex items-center gap-1 px-2 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 transition ${
            btn.isActive()
              ? "bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-200"
              : "text-slate-700"
          }`}
        >
          {btn.name}
        </button>
      ))}

      {/* Arka Plan Renk Butonları */}
      {bgColors.map((bg) => (
        <button
          key={bg.name}
          type="button"
          onClick={() => editor.chain().focus().setBackgroundColor(bg.color).run()}
          title={bg.name}
          className="flex items-center gap-1 px-2 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
        >
          <span
            className="w-4 h-4 rounded-full border border-slate-300"
            style={{ backgroundColor: bg.color }}
          />
        </button>
      ))}

      {/* Hizalama */}
      {[
        { name: "Sol", value: "left" },
        { name: "Orta", value: "center" },
        { name: "Sağ", value: "right" },
      ].map((align) => (
        <button
          key={align.value}
          aria-label={`${align.name} Hizala`}
          type="button"
          onClick={() => editor.chain().focus().setTextAlign(align.value).run()}
          className={`flex items-center gap-1 px-2 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 transition ${
            editor.isActive({ textAlign: align.value })
              ? "bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-200"
              : "text-slate-700"
          }`}
        >
          {align.name}
        </button>
      ))}
    </div>
  );
}

