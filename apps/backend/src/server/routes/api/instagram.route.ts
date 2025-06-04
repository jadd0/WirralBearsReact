import { Router, Request, Response } from 'express';
import {
	getPosts,
	getRefreshToken,
} from '@/server/controllers/instagram.controllers';

const router: Router = Router();

router.get('/posts', getPosts);
router.post('/refreshToken', getRefreshToken);

export default router;
