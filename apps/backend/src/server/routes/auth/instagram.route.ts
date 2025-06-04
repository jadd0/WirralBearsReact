import { Router } from 'express';
import {
	initiateInstagramAuth,
	handleInstagramCallback,
	getInstagramAuthStatus,
} from '@/server/controllers/auth.controllers';

const router: Router = Router();

router.get('/', initiateInstagramAuth);
router.get('/callback', handleInstagramCallback);
router.get('/status', getInstagramAuthStatus);

export default router;
