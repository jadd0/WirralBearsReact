import { Router } from 'express';
import * as blogControllers from '../../controllers/blog.controllers';
import { ensureAuthenticated } from '@/server/middleware/auth.middleware';

const router: Router = Router();

// GET all blogs
router.get('/', blogControllers.getAllBlogs);

// GET a single blog by ID
router.get('/:id', blogControllers.getBlogById);

// POST a new blog
router.post('/saveBlog', ensureAuthenticated, blogControllers.createBlog);

// PUT (update) an existing blog
router.put('/:id', ensureAuthenticated, blogControllers.updateBlog);

// DELETE a blog
router.delete('/:id', ensureAuthenticated, blogControllers.deleteBlog);

export default router;
