import { blogServices } from '../services/blog.services';
import { BlogData } from '@wirralbears/types';
import { RequestHandler, Request, Response } from 'express';

export const getAllBlogs: RequestHandler = async (req, res) => {
  try {
    const blogs = await blogServices.getAllBlogs();
    res.status(200).send({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send({ message: 'Failed to fetch blogs' });
  }
};

export const getBlogById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const blogId = parseInt(id);

  if (isNaN(blogId)) {
    res.status(400).send({ message: 'Invalid blog ID' });
    return;
  }

  try {
    const blog = await blogServices.getBlogById(blogId);
    
    if (blog) res.status(200).send({ blog });
    else res.status(404).send({ message: 'Blog not found' });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).send({ message: 'Failed to fetch blog' });
  }
};

export const createBlog: RequestHandler = async (req, res) => {
  const authorId = req.body.authorId || 1;
  const blogData: BlogData = req.body.blogData;

  if (!blogData || !blogData.elements) {
    res.status(400).send({ message: 'Invalid blog data' });
    return;
  }

  try {
    const newBlog = await blogServices.createBlog(authorId, blogData);
    res.status(201).send({ blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).send({ message: 'Failed to create blog' });
  }
};

export const updateBlog: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const blogId = parseInt(id);
  
  if (isNaN(blogId)) {
    res.status(400).send({ message: 'Invalid blog ID' });
    return;
  }

  const blogData: BlogData = req.body.blogData;
  
  if (!blogData || !blogData.elements) {
    res.status(400).send({ message: 'Invalid blog data' });
    return;
  }

  try {
    const updatedBlog = await blogServices.updateBlog(blogId, blogData);
    
    if (updatedBlog) res.status(200).send({ blog: updatedBlog });
    else res.status(404).send({ message: 'Blog not found' });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).send({ message: 'Failed to update blog' });
  }
};

export const deleteBlog: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const blogId = parseInt(id);
  
  if (isNaN(blogId)) {
    res.status(400).send({ message: 'Invalid blog ID' });
    return;
  }

  try {
    const result = await blogServices.deleteBlog(blogId);
    
    if (result) res.status(200).send({ message: 'Blog deleted successfully' });
    else res.status(404).send({ message: 'Blog not found' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).send({ message: 'Failed to delete blog' });
  }
};

export default {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} as {}
