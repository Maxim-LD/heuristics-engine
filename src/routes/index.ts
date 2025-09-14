// Main API routes for heuristics engine
import { Router } from "express";
import emailRouter from "./email";
import urlRouter from "./url";
import qrRouter from "./qr";

const router = Router()

router.use(qrRouter)
router.use(urlRouter)
router.use(emailRouter)

export default router
