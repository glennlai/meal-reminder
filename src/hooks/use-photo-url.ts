import { useEffect, useState } from "react";
import { mealRepository } from "@/repositories/local-meal-repository";

export function usePhotoUrl(photoBlobId: string | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photoBlobId) {
      setUrl(null);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    void mealRepository.getPhotoBlob(photoBlobId).then((blob) => {
      if (cancelled || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photoBlobId]);

  return url;
}
