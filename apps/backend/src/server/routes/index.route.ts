import { Router, Request, Response } from 'express';
import api from '@server/routes/api/api.route';
import auth from '@server/routes/auth/auth.route';

const router: Router = Router();

router.use('/api', api);
router.use('/auth', auth);

// Simple endpoint to keep render server working
router.get('/health', (req, res) => {
	res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
