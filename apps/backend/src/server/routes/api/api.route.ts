import { Router } from "express";
import blogRouter from "./blog.route"
import imageRouter from "./image.route"
import instagramRouter from "./instagram.route"

const router: Router = Router();

router.use("/blog", blogRouter)
router.use("/image", imageRouter)
router.use("/instagram", instagramRouter)

export default router;
