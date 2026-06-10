"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { backgroundRefresh } from "@/lib/utils/refresh";
import { Camera, Trash2 } from "lucide-react";

import { deletePhoto, uploadPhoto } from "@/lib/actions/photos";
import { Button } from "@/components/ui/button";
import { PHOTO_CATEGORY_LABELS, type Photo, type PhotoCategory } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

interface PhotoTimelineProps {
  siteId: string;
  initialPhotos: Photo[];
}

function formatTimelineDate(iso: string): string {
  const d = new Date(iso);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}） ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const categoryColors: Record<PhotoCategory, string> = {
  before: "bg-slate-200 text-slate-800",
  during: "bg-blue-100 text-blue-900",
  after: "bg-emerald-100 text-emerald-900",
};

export function PhotoTimeline({ siteId, initialPhotos }: PhotoTimelineProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploadCategory, setUploadCategory] = useState<PhotoCategory>("during");
  const [uploading, setUploading] = useState(false);

  const sorted = useMemo(
    () => [...photos].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [photos]
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", uploadCategory);

    const result = await uploadPhoto(siteId, formData);
    if (result.success) {
      setPhotos((prev) => [result.data, ...prev]);
      backgroundRefresh(router);
    } else {
      alert(result.error);
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(photoId: string) {
    if (!confirm("この写真を削除しますか？")) return;
    const previous = photos;
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    const result = await deletePhoto(photoId, siteId);
    if (!result.success) {
      setPhotos(previous);
    } else {
      backgroundRefresh(router);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {(["before", "during", "after"] as PhotoCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setUploadCategory(cat)}
            className={cn(
              "tap-scale min-h-[56px] rounded-xl border-2 px-2 text-base font-bold",
              uploadCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-slate-300 bg-white"
            )}
          >
            {PHOTO_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <label className="tap-scale flex cursor-pointer">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
        <div className="flex w-full min-h-[72px] items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary bg-accent px-4 py-5 text-xl font-bold text-primary">
          <Camera className="h-8 w-8" />
          {uploading ? "送信中..." : "写真を撮る"}
        </div>
      </label>

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-lg text-muted-foreground">写真はまだありません</p>
      ) : (
        <div className="relative space-y-0">
          <div className="absolute bottom-4 left-5 top-4 w-1 rounded-full bg-slate-300" aria-hidden />
          {sorted.map((photo, i) => (
            <div key={photo.id} className="relative pb-6 pl-12">
              <div
                className="absolute left-3 top-2 h-5 w-5 rounded-full border-4 border-white bg-primary shadow"
                aria-hidden
              />
              <div className="rounded-xl border-2 border-slate-300 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-bold">{formatTimelineDate(photo.created_at)}</p>
                  <span className={cn("rounded-lg px-3 py-1 text-base font-bold", categoryColors[photo.category])}>
                    {PHOTO_CATEGORY_LABELS[photo.category]}
                  </span>
                </div>
                {photo.url && (
                  <div className="relative mt-3 overflow-hidden rounded-xl">
                    <Image
                      src={photo.url}
                      alt={photo.file_name ?? "現場写真"}
                      width={600}
                      height={450}
                      className="aspect-[4/3] w-full object-cover"
                      sizes="100vw"
                      priority={i === 0}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-3 top-3 h-12 w-12 tap-scale shadow-md"
                      onClick={() => handleDelete(photo.id)}
                      aria-label="削除"
                    >
                      <Trash2 className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
