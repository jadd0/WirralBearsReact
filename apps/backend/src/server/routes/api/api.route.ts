import { Router } from "express";
import blogRouter from "./blog.route"

const router: Router = Router();

router.use("/blog", blogRouter)

export default router;
