import { Router } from 'express';
import blogRouter from './blog.route';
import imageRouter from './image.route';
import coachRouter from './coach.route';
import sessionRouter from './session.route';

const router: Router = Router();

router.use('/blog', blogRouter);
router.use('/image', imageRouter);
router.use('/coach', coachRouter);
router.use('/session', sessionRouter);

export default router;
