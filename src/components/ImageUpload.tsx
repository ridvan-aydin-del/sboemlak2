"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import type { DragEndEvent } from "@dnd-kit/core";

interface Props {
  onUploadComplete: (urls: string[]) => void;
  initialImages?: string[];
}

function SortableItem({
  id,
  url,
  index,
  coverIndex,
  onSetCover,
}: {
  id: string;
  url: string;
  index: number;
  coverIndex: number;
  onSetCover: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "none", // geçiş efekti kapatıldı
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative w-full aspect-square">
      <div {...listeners} className="w-full h-full">
        <Image src={url} alt={`preview-${index}`} fill className="object-cover rounded-lg border border-slate-200" />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSetCover(index);
        }}
        className={`absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded max-w-[90%] whitespace-nowrap shadow-sm ${
          index === coverIndex
            ? "bg-emerald-600 text-white"
            : "bg-black/50 text-white hover:bg-black"
        }`}
      >
        {index === coverIndex ? "Kapak" : "Kapak yap"}
      </button>
    </div>
  );
}

export default function ImageUpload({ onUploadComplete, initialImages }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setPreviewUrls(initialImages);
      setSelectedFiles([]); // Yeni upload yapılmadı
      setCoverIndex(0);
    }
  }, [initialImages]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor)); // mobil destek

  // max genişlik/yükseklik ile yeniden boyutlandırma
  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const maxWidth = 2400;
          const maxHeight = 1600;

          let targetWidth = img.width;
          let targetHeight = img.height;

          if (img.width > img.height) {
            if (img.width > maxWidth) {
              targetWidth = maxWidth;
              targetHeight = (img.height / img.width) * maxWidth;
            }
          } else {
            if (img.height > maxHeight) {
              targetHeight = maxHeight;
              targetWidth = (img.width / img.height) * maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(resizedFile);
              }
            },
            file.type,
            0.95
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setCoverIndex(0);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);

    setPreviewUrls((items) => arrayMove(items, oldIndex, newIndex));
    setSelectedFiles((items) => arrayMove(items, oldIndex, newIndex));

    if (coverIndex === oldIndex) {
      setCoverIndex(newIndex);
    } else if (oldIndex < coverIndex && newIndex >= coverIndex) {
      setCoverIndex((prev) => prev - 1);
    } else if (oldIndex > coverIndex && newIndex <= coverIndex) {
      setCoverIndex((prev) => prev + 1);
    }
  };

  const handleSetCover = (index: number) => {
    setCoverIndex(index);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);

    const orderedFiles = [
      selectedFiles[coverIndex],
      ...selectedFiles.filter((_, i) => i !== coverIndex),
    ];

    const resizedFiles = await Promise.all(orderedFiles.map((file) => resizeImage(file)));

    const formData = new FormData();
    resizedFiles.forEach((file) => formData.append("files", file));

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    onUploadComplete(data.urls);
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
      />

      {previewUrls.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext items={previewUrls.map((_, i) => i.toString())} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {previewUrls.map((url, i) => (
                <SortableItem
                  key={i}
                  id={i.toString()}
                  url={url}
                  index={i}
                  coverIndex={coverIndex}
                  onSetCover={handleSetCover}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
      >
        {uploading ? "Yükleniyor..." : "Fotoğrafları Yükle"}
      </button>
    </div>
  );
}

