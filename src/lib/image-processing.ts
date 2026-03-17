type ImageOutputFormat = "image/jpeg" | "image/webp" | "image/png";

export interface ImageProcessingOptions {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
  format?: ImageOutputFormat;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to decode image"));
    image.src = src;
  });
}

function getScaledSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) {
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  format: ImageOutputFormat,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode optimized image"));
          return;
        }

        try {
          resolve(await readFileAsDataUrl(new File([blob], "optimized-image")));
        } catch (error) {
          reject(error);
        }
      },
      format,
      quality,
    );
  });
}

export async function optimizeImageFile(
  file: File,
  {
    maxWidth,
    maxHeight,
    quality = 0.82,
    format = "image/webp",
  }: ImageProcessingOptions,
): Promise<string> {
  const sourceDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(sourceDataUrl);
  const scaled = getScaledSize(
    image.naturalWidth,
    image.naturalHeight,
    maxWidth,
    maxHeight,
  );

  const canvas = document.createElement("canvas");
  canvas.width = scaled.width;
  canvas.height = scaled.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, scaled.width, scaled.height);

  return canvasToDataUrl(canvas, format, quality);
}
