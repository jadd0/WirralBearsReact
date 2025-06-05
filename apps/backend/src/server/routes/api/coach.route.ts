import { Router } from 'express';
import * as coachControllers from '../../controllers/coach.controllers';
import { ensureAuthenticated } from '@/server/middleware/auth.middleware';
import multer from 'multer';

const router: Router = Router();
const upload = multer();

// PUT (update) an existing coach
router.put(
	'/editCoach/:id',
	ensureAuthenticated,
	upload.any(),
	coachControllers.updateCoach
);

// GET a single coach by ID
router.get('/getCoach/:id', coachControllers.getCoachById);

// POST a new coach
router.post(
	'/saveCoach',
	ensureAuthenticated,
	upload.any(),
	coachControllers.createCoach
);

// POST to upload a single image
router.post(
	'/uploadImage',
	ensureAuthenticated,
	upload.single('image'),
	coachControllers.uploadImage
);

router.get(
	'/getAllCoachPreviews',
	coachControllers.getAllCoachPreviews
);


// DELETE a coach
router.delete('/deleteCoach/:id', ensureAuthenticated, coachControllers.deleteCoach);

export default router;
