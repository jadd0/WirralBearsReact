import { Router } from 'express';
import {
	initiateInstagramAuth,
	handleInstagramCallback,
	getInstagramAuthStatus,
} from '@/server/controllers/auth.controllers';

const router: Router = Router();

router.get('/instagram', initiateInstagramAuth);
router.get('/instagram/callback', handleInstagramCallback);
router.get('/instagram/status', getInstagramAuthStatus);

export default router;
