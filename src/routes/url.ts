import { Router } from "express";
import { analyzeUrl } from "../services/urlAnalyzer";

const urlRouter = Router()

// POST /api/analyze-url
// Analyzes a URL and returns risk assessment
urlRouter.post('/analyze-url', (req, res) => {
    const { url } = req.body
    if (!url) {
        return res.status(422).json({
            success: false,
            message: 'URL is required!',
            error: {
                code: 'URL_REQUIRED'
            }
        })
    }

    try {
        // Analyze the URL using heuristics service
        const result = analyzeUrl(url)

        return res.status(200).json({
            success: true,
            message: 'URL analyzed successfully',
            data: result
        })

    } catch (err: any) {
        // Handle errors from heuristics service
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    }
})

export default urlRouter
