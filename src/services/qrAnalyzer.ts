import { createCanvas, loadImage } from "canvas";
import jsQR from "jsqr";
import { analyzeUrl } from "./urlAnalyzer";
import { AppError } from "../utils/errors";

export const analyzeQr = async (imagePath: string) => {
    try {
        const img = await loadImage(imagePath)
        const canvas = createCanvas(img.width, img.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
    
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const qrCode = jsQR(imageData.data, img.width, img.height)
    
        if (!qrCode || !qrCode.data) {
            throw new AppError("No QR code detected", 400, "QR_NOT_FOUND");
        }
        
        return analyzeUrl(qrCode.data)

    } catch (error: any) {
        throw new AppError("Failed to analyze QR code", 500, "QR_ANALYSIS_ERROR")
    }
}