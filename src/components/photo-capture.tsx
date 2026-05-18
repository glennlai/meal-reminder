import { useEffect, useRef, useState } from "react";

interface PhotoCaptureProps {
  onPhoto: (blob: Blob) => void;
}

export function PhotoCapture({ onPhoto }: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onPhoto(file);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={openPicker}
        className="interactive-focus relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-100 ring-1 ring-brand-200 transition hover:ring-2 hover:ring-brand-400"
        aria-label={previewUrl ? "Change meal photo" : "Add meal photo"}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Meal preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="px-4 text-center text-sm text-brand-700">
            Tap to add a photo of your meal
          </span>
        )}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={openPicker}
          className="interactive-focus rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          {previewUrl ? "Change photo" : "Take / choose photo"}
        </button>
        {previewUrl && (
          <button
            type="button"
            onClick={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="interactive-focus rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
