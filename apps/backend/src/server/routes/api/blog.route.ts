import { Router } from 'express';
import * as blogControllers from '../../controllers/blog.controllers';
import { ensureAuthenticated } from '@/server/middleware/auth.middleware';
import multer from 'multer';

const router: Router = Router();
const upload = multer();

// GET all blogs
router.get('/', blogControllers.getAllBlogs);

// GET a single blog by ID
router.get('/:id', blogControllers.getBlogById);

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

router.get(
	'/getAllBlogPreviews',
	ensureAuthenticated,
	blogControllers.getAllBlogPreviews
)

// PUT (update) an existing blog
// router.put(
// 	'/:id',
// 	ensureAuthenticated,
// 	upload.any(),
// 	blogControllers.updateBlog
// );

// DELETE a blog
router.delete('/:id', ensureAuthenticated, blogControllers.deleteBlog);

export default router;
