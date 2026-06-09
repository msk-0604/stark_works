"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Trash2 } from "lucide-react";

import { deletePhoto, uploadPhoto } from "@/lib/actions/photos";
import { Button } from "@/components/ui/button";
import { PHOTO_CATEGORY_LABELS, type Photo, type PhotoCategory } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

interface PhotoGalleryProps {
  siteId: string;
  initialPhotos: Photo[];
}

const categories: PhotoCategory[] = ["before", "during", "after"];

export function PhotoGallery({ siteId, initialPhotos }: PhotoGalleryProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>("during");
  const [uploading, setUploading] = useState(false);

  const filtered = photos.filter((p) => p.category === activeCategory);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", activeCategory);

    const result = await uploadPhoto(siteId, formData);
    if (result.success) {
      setPhotos((prev) => [result.data, ...prev]);
      router.refresh();
    } else {
      alert(result.error);
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(photoId: string) {
    if (!confirm("この写真を削除しますか？")) return;
    await deletePhoto(photoId, siteId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "tap-scale min-h-[52px] rounded-xl border-2 px-2 text-base font-bold transition-colors",
              activeCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground"
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

      {filtered.length === 0 ? (
        <p className="py-6 text-center text-lg text-muted-foreground">
          {PHOTO_CATEGORY_LABELS[activeCategory]}の写真はまだありません
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((photo) => (
            <div key={photo.id} className="relative overflow-hidden rounded-xl border-2 border-border">
              {photo.url && (
                <Image
                  src={photo.url}
                  alt={photo.file_name ?? "現場写真"}
                  width={400}
                  height={400}
                  className="aspect-[4/3] w-full object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              )}
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
          ))}
        </div>
      )}
    </div>
  );
}
