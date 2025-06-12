import { Router } from 'express';
import * as blogControllers from '../../controllers/blog.controllers';
import { ensureAuthenticated } from '@/server/middleware/auth.middleware';
import multer from 'multer';

const router: Router = Router();
const upload = multer();

// PUT (update) an existing blog
router.put(
	'/editBlog/:id',
	ensureAuthenticated,
	upload.any(),
	blogControllers.updateBlog
);

// GET a single blog by ID
router.get('/getBlog/:id', blogControllers.getBlogById);

// POST a new blog
router.post(
	'/saveBlog',
	ensureAuthenticated,
	upload.any(),
	blogControllers.createBlog
);

// POST to upload a single image
router.post(
	'/uploadImage',
	ensureAuthenticated,
	upload.single('image'),
	blogControllers.uploadImage
);

// POST to upload multiple images
router.post(
	'/uploadMultipleImages',
	ensureAuthenticated,
	upload.array('images'),
	blogControllers.uploadMultipleImages
);

router.get('/getAllBlogPreviews', blogControllers.getAllBlogPreviews);

// DELETE a blog
router.delete(
	'/deleteBlog/:id',
	ensureAuthenticated,
	blogControllers.deleteBlog
);

export default router;
