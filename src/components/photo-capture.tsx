import { useEffect, useRef, useState } from "react";

interface PhotoCaptureProps {
  onPhoto: (blob: Blob) => void;
}

export function PhotoCapture({ onPhoto }: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setIsLoading(true);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onPhoto(file);
    setIsLoading(false);
  };

  const openPicker = () => inputRef.current?.click();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file ?? null);
  };

  return (
    <div className="space-y-4">

      {/* MAIN UPLOAD AREA */}
      <button
        type="button"
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl
          ring-1 shadow-sm transition-all duration-300
          ${isDragging
            ? "scale-[1.01] ring-brand-500 bg-brand-100 shadow-lg"
            : "bg-gradient-to-br from-brand-50 to-brand-100 ring-brand-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-brand-400"
          }`}
        aria-label={previewUrl ? "Change meal photo" : "Add meal photo"}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Meal preview"
            className="h-full w-full object-cover blur-sm scale-105 transition duration-700 group-hover:scale-[1.02]"
            onLoad={(e) => {
              e.currentTarget.classList.remove("blur-sm", "scale-105");
            }}
            onLoadStart={(e) => {
              e.currentTarget.classList.add("blur-sm", "scale-105");
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-brand-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-2xl font-bold text-brand-600 shadow-sm transition group-hover:scale-110">
              +
            </div>

            <span className="px-4 text-center text-sm font-medium text-brand-700/80">
              {isDragging ? "Drop your photo here" : "Tap or drag a meal photo"}
            </span>

            <span className="text-xs text-brand-500">
              JPG, PNG • Camera supported
            </span>
          </div>
        )}
      </button>

      {/* ACTION BUTTONS */}
      {previewUrl && (
        <div className="grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={openPicker}
            className="rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 active:scale-[0.98]"
          >
            Change photo
          </button>

          <button
            type="button"
            onClick={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 active:scale-[0.98]"
          >
            Remove
          </button>

        </div>
      )}

      {/* FILE INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
