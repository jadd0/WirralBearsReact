import { Router } from 'express';
import multer from 'multer';
import * as imageControllers from '@/server/controllers/image.controllers';
import { ensureAuthenticated } from '@/server/middleware/auth.middleware';

const router: Router = Router();

// GET a single blog by ID
router.get('/getAllImages/:cursor', imageControllers.getAllImages);

// DELETE a single image by ID
router.delete('/deleteImage/:imageId', ensureAuthenticated, imageControllers.deleteImage)

// GET all images for the first home images carousel
router.get('/getAllFirstCarouselImages', imageControllers.getAllFirstCarouselImages)

// GET all images for the b4a home images carousel
router.get('/getAllB4ACarouselImages', imageControllers.getAllB4ACarouselImages)

// PUT all images to replace home carousel images
router.put('/replaceAllFirstCarouselImages', ensureAuthenticated, imageControllers.replaceAllFirstCarouselImages)

// PUT all images to replace b4a carousel images
router.put('/replaceAllB4ACarouselImages', ensureAuthenticated, imageControllers.replaceAllB4ACarouselImages)

// TODO: refactor all image stuff from blog routes into here
export default router;
