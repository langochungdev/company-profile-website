// Utility resize ảnh client-side với target file size

export type ImageQuality = "default" | "high";

interface ResizeConfig {
    maxWidth: number;
    targetMax: number;
    startQuality: number;
    minQuality: number;
    qualityStep: number;
}

const PRESETS: Record<ImageQuality, ResizeConfig> = {
    default: {
        maxWidth: 1200,
        targetMax: 150 * 1024,
        startQuality: 0.75,
        minQuality: 0.2,
        qualityStep: 0.1,
    },
    high: {
        maxWidth: 2400,
        targetMax: 600 * 1024,
        startQuality: 0.9,
        minQuality: 0.4,
        qualityStep: 0.1,
    },
};

const SKIP_RESIZE_TYPES = ["image/gif", "image/svg+xml"];
const OUTPUT_FORMAT = "image/webp";
const MAX_ITERATIONS = 6;

export async function resizeImage(file: File, quality: ImageQuality = "default"): Promise<File> {
    if (SKIP_RESIZE_TYPES.includes(file.type)) {
        return file;
    }

    const config = PRESETS[quality];

    if (file.size <= config.targetMax) {
        return file;
    }

    const img = await loadImage(file);

    const needsResize = img.width > config.maxWidth;
    const { width, height } = needsResize ? calculateDimensions(img.width, img.height, config.maxWidth) : { width: img.width, height: img.height };

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return file;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    let currentQuality = config.startQuality;
    let blob = await canvasToBlob(canvas, OUTPUT_FORMAT, currentQuality);
    let iteration = 1;

    while (blob.size > config.targetMax && currentQuality > config.minQuality && iteration < MAX_ITERATIONS) {
        currentQuality -= config.qualityStep;
        currentQuality = Math.max(currentQuality, config.minQuality);
        blob = await canvasToBlob(canvas, OUTPUT_FORMAT, currentQuality);
        iteration++;
    }

    if (blob.size >= file.size) {
        return file;
    }

    const newName = file.name.replace(/\.[^.]+$/, ".webp");
    return new File([blob], newName, { type: OUTPUT_FORMAT });
}

function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(img.src);
            reject(new Error("Failed to load image"));
        };
        img.src = URL.createObjectURL(file);
    });
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function calculateDimensions(origWidth: number, origHeight: number, maxWidth: number): { width: number; height: number } {
    const ratio = origHeight / origWidth;
    const width = Math.min(origWidth, maxWidth);
    const height = Math.round(width * ratio);
    return { width, height };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Failed to convert canvas to blob"));
                }
            },
            type,
            quality,
        );
    });
}
