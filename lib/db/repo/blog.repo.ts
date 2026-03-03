import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  blogs,
  blogHeadings,
  blogParagraphs,
  blogImages,
  images,
  users,
  type Blog,
  type NewBlog,
} from "@/schemas";
import { HeadingElement, ParagraphElement, ImageElement } from "./coach.repo";

export type BlogPreview = {
  id: string;
  title: string;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
  image: {
    id: string;
    key: string;
    url: string;
    authorId: string;
    alt: string | null;
  } | null;
};

export type BlogElement = HeadingElement | ParagraphElement | ImageElement;

export type BlogData = {
  elements: BlogElement[];
};

export const blogRepository = {
  async findAll() {
    const lowestPositionImages = db
      .select({
        blogId: blogImages.blogId,
        minPosition: sql<number>`min(${blogImages.position})`.as("minPosition"),
      })
      .from(blogImages)
      .groupBy(blogImages.blogId)
      .as("lowestPositionImages");

    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        name: users.name,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        imageId: images.id,
        key: images.key,
        url: images.url,
        authorId: images.authorId,
        alt: images.alt,
      })
      .from(blogs)
      .leftJoin(lowestPositionImages, eq(blogs.id, lowestPositionImages.blogId))
      .leftJoin(
        blogImages,
        and(
          eq(blogs.id, blogImages.blogId),
          eq(blogImages.position, lowestPositionImages.minPosition),
        ),
      )
      .leftJoin(images, eq(blogImages.imageId, images.id))
      .leftJoin(users, eq(blogs.authorId, users.id))
      .orderBy(blogs.createdAt);

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      name: r.name ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      image: r.imageId
        ? {
            id: r.imageId,
            key: r.key!,
            url: r.url!,
            authorId: r.authorId!,
            alt: r.alt ?? null,
          }
        : null,
    }));
  },

  async getBlogById(blogId: string) {
    const blogResult = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        authorId: blogs.authorId,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        authorUserId: users.id,
        name: users.name,
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .where(eq(blogs.id, blogId));

    if (blogResult.length === 0) return null;

    const blogRow = blogResult[0];

    const [headings, paragraphs, blogImagesWithDetails] = await Promise.all([
      db
        .select()
        .from(blogHeadings)
        .where(eq(blogHeadings.blogId, blogId))
        .orderBy(blogHeadings.position),
      db
        .select()
        .from(blogParagraphs)
        .where(eq(blogParagraphs.blogId, blogId))
        .orderBy(blogParagraphs.position),
      db
        .select({
          id: images.id,
          key: images.key,
          url: images.url,
          alt: images.alt,
          position: blogImages.position,
        })
        .from(blogImages)
        .leftJoin(images, eq(blogImages.imageId, images.id))
        .where(eq(blogImages.blogId, blogId))
        .orderBy(blogImages.position),
    ]);

    return {
      id: blogRow.id,
      title: blogRow.title,
      authorId: blogRow.authorId,
      createdAt: blogRow.createdAt,
      updatedAt: blogRow.updatedAt,
      author: {
        id: blogRow.authorUserId,
        name: blogRow.name,
      },
      headings,
      paragraphs,
      images: blogImagesWithDetails,
    };
  },

  async createBlogWithTransaction(
    title: string,
    authorId: string,
    headings: HeadingElement[],
    paragraphs: ParagraphElement[],
    imageReferences: { imageId: string; position: number }[],
  ): Promise<Blog> {
    return db.transaction(async (tx) => {
      const [blog] = await tx
        .insert(blogs)
        .values({ title, authorId })
        .returning();

      if (headings.length > 0) {
        await tx.insert(blogHeadings).values(
          headings.map((h) => ({
            text: h.text,
            blogId: blog.id,
            position: h.position ?? 0,
          })),
        );
      }

      if (paragraphs.length > 0) {
        await tx.insert(blogParagraphs).values(
          paragraphs.map((p) => ({
            text: p.text,
            blogId: blog.id,
            position: p.position ?? 0,
          })),
        );
      }

      if (imageReferences.length > 0) {
        await tx.insert(blogImages).values(
          imageReferences.map((ref) => ({
            blogId: blog.id,
            imageId: ref.imageId,
            position: ref.position,
          })),
        );
      }

      return blog;
    });
  },

  async updateBlogWithTransaction(
    blogId: string,
    title: string,
    headings: HeadingElement[],
    paragraphs: ParagraphElement[],
    imageReferences: { imageId: string; position: number }[],
  ): Promise<Blog> {
    return db.transaction(async (tx) => {
      const [blog] = await tx
        .update(blogs)
        .set({ title, updatedAt: new Date() })
        .where(eq(blogs.id, blogId))
        .returning();

      await Promise.all([
        tx.delete(blogHeadings).where(eq(blogHeadings.blogId, blogId)),
        tx.delete(blogParagraphs).where(eq(blogParagraphs.blogId, blogId)),
        tx.delete(blogImages).where(eq(blogImages.blogId, blogId)),
      ]);

      if (headings.length > 0) {
        await tx.insert(blogHeadings).values(
          headings.map((h) => ({
            text: h.text,
            blogId: blog.id,
            position: h.position ?? 0,
          })),
        );
      }

      if (paragraphs.length > 0) {
        await tx.insert(blogParagraphs).values(
          paragraphs.map((p) => ({
            text: p.text,
            blogId: blog.id,
            position: p.position ?? 0,
          })),
        );
      }

      if (imageReferences.length > 0) {
        await tx.insert(blogImages).values(
          imageReferences.map((ref) => ({
            blogId: blog.id,
            imageId: ref.imageId,
            position: ref.position,
          })),
        );
      }

      return blog;
    });
  },

  async updateBlog(
    id: string,
    blog: Partial<NewBlog>,
  ): Promise<Blog | undefined> {
    const result = await db
      .update(blogs)
      .set({ ...blog, updatedAt: new Date() })
      .where(eq(blogs.id, id))
      .returning();

    return result[0];
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();

    return result.length > 0;
  },
};
