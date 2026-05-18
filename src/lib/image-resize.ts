const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.85;

export async function resizePhoto(file: Blob): Promise<Blob> {
  const isImage =
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(
      file instanceof File ? file.name : "",
    );
  if (!isImage) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      resolve(file);
    }, 10_000);

    canvas.toBlob(
      (blob) => {
        clearTimeout(timeout);
        if (blob) resolve(blob);
        else resolve(file);
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}
