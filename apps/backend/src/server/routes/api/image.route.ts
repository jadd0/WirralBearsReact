import { Router } from 'express';
import multer from 'multer';
import * as imageControllers from '@/server/controllers/image.controllers';
import { ensureAuthenticated } from '@/server/middleware/auth.middleware';

const router: Router = Router();

// GET a single blog by ID
router.get('/getAllImages/:cursor', imageControllers.getAllImages);

// DELETE a single image by ID
router.delete('/deleteImage/:imageId', ensureAuthenticated, imageControllers.deleteImage)

// TODO: refactor all image stuff from blog routes into here
export default router;
