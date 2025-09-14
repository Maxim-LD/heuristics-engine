// Main API routes for heuristics engine
import multer from "multer";
import { Router } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { analyzeQr } from "../services/qrAnalyzer";

const qrRouter = Router()

const upload = multer({ dest: 'uploads/qr/' })


console.log('here');

// POST /api/analyze-qr
qrRouter.post('/analyze-qr', upload.single('file'),
    catchAsync(async (req, res) => {
        if (!req.file) {
            return res.status(422).json({
                success: false,
                message: 'No file uploaded!',
                error: {
                    code: 'QR_FILE_REQUIRED'
                }
            })
        }

        const result = await analyzeQr(req.file.path)
        
        return res.status(200).json({
            success: true,
            message: 'QR analyzed successfully',
            data: result
        })
    })
)

export default qrRouter