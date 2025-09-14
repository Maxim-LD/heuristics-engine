import { Router } from "express";
import multer from "multer";
import { parseEmlToJson } from "../utils/emailParser";
import { analyzeEmail } from "../services/emailAnalyzer";
import { catchAsync } from "../middlewares/errorHandler";

const upload = multer({ dest: "uploads/email" });

const emailRouter = Router();

emailRouter.post("/analyze-email",  upload.single("email"),
    catchAsync(async (req, res) => {
        if (!req.file) {
            return res.status(422).json({
                success: false,
                message: 'No email file uploaded',
                error: {
                    code: 'EMAIL_FILE_REQUIRED'
                }
            })
        }

        const emailJson = await parseEmlToJson(req.file.path);
        const analysis = analyzeEmail(emailJson);

        return res.status(200).json({
            success: true,
            message: 'Email analyzed successfully',
            data: analysis
        })
    })
);

export default emailRouter;
