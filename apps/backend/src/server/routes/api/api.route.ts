import { Router } from 'express';
import blogRouter from './blog.route';
import imageRouter from './image.route';
import coachRouter from './coach.route';

const router: Router = Router();

router.use('/blog', blogRouter);
router.use('/image', imageRouter);
router.use('/coach', coachRouter);

export default router;
