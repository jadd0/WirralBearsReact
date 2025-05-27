import { Router } from "express";
import blogRouter from "./blog.route"
import imageRouter from "./image.route"

const router: Router = Router();

router.use("/blog", blogRouter)
router.use("/image", imageRouter)

export default router;
