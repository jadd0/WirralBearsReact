// src/server/repositories/coach.repo.ts
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  coaches,
  coachHeadings,
  coachParagraphs,
  coachImages,
  images,
  users,
  type Coaches,
  type NewCoach,
} from "@/schemas";

export type CoachPreview = {
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

export type HeadingElement = {
  type: "heading";
  text: string;
  position?: number;
};

export type ParagraphElement = {
  type: "paragraph";
  text: string;
  position?: number;
};

export type ImageElement = {
  type: "image";
  imageId?: string;
  url?: string;
  position?: number;
};

export const coachRepository = {
  async findAll() {
    const lowestPositionImages = db
      .select({
        coachId: coachImages.coachId,
        minPosition: sql<number>`min(${coachImages.position})`.as(
          "minPosition",
        ),
      })
      .from(coachImages)
      .groupBy(coachImages.coachId)
      .as("lowestPositionImages");

    const rows = await db
      .select({
        id: coaches.id,
        title: coaches.title,
        name: users.name,
        createdAt: coaches.createdAt,
        updatedAt: coaches.updatedAt,
        imageId: images.id,
        key: images.key,
        url: images.url,
        authorId: images.authorId,
        alt: images.alt,
      })
      .from(coaches)
      .leftJoin(
        lowestPositionImages,
        eq(coaches.id, lowestPositionImages.coachId),
      )
      .leftJoin(
        coachImages,
        and(
          eq(coaches.id, coachImages.coachId),
          eq(coachImages.position, lowestPositionImages.minPosition),
        ),
      )
      .leftJoin(images, eq(coachImages.imageId, images.id))
      .leftJoin(users, eq(coaches.authorId, users.id))
      .orderBy(coaches.createdAt);

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

  async getCoachById(coachId: string) {
    const coachResult = await db
      .select({
        id: coaches.id,
        title: coaches.title,
        authorId: coaches.authorId,
        createdAt: coaches.createdAt,
        updatedAt: coaches.updatedAt,
        authorUserId: users.id,
        name: users.name,
      })
      .from(coaches)
      .leftJoin(users, eq(coaches.authorId, users.id))
      .where(eq(coaches.id, coachId));

    if (coachResult.length === 0) return null;
    const coachRow = coachResult[0];

    const [headings, paragraphs, coachImagesWithDetails] = await Promise.all([
      db
        .select()
        .from(coachHeadings)
        .where(eq(coachHeadings.coachId, coachId))
        .orderBy(coachHeadings.position),
      db
        .select()
        .from(coachParagraphs)
        .where(eq(coachParagraphs.coachId, coachId))
        .orderBy(coachParagraphs.position),
      db
        .select({
          id: images.id,
          key: images.key,
          url: images.url,
          alt: images.alt,
          position: coachImages.position,
        })
        .from(coachImages)
        .leftJoin(images, eq(coachImages.imageId, images.id))
        .where(eq(coachImages.coachId, coachId))
        .orderBy(coachImages.position),
    ]);

    return {
      id: coachRow.id,
      title: coachRow.title,
      authorId: coachRow.authorId,
      createdAt: coachRow.createdAt,
      updatedAt: coachRow.updatedAt,
      author: {
        id: coachRow.authorUserId,
        name: coachRow.name,
      },
      headings,
      paragraphs,
      images: coachImagesWithDetails,
    };
  },

  async createCoachWithTransaction(
    title: string,
    authorId: string,
    headings: HeadingElement[],
    paragraphs: ParagraphElement[],
    imageReferences: { imageId: string; position: number }[],
  ): Promise<Coaches> {
    return db.transaction(async (tx) => {
      const [coach] = await tx
        .insert(coaches)
        .values({ title, authorId })
        .returning();

      if (headings.length > 0) {
        await tx.insert(coachHeadings).values(
          headings.map((h) => ({
            text: h.text,
            coachId: coach.id,
            position: h.position ?? 0,
          })),
        );
      }

      if (paragraphs.length > 0) {
        await tx.insert(coachParagraphs).values(
          paragraphs.map((p) => ({
            text: p.text,
            coachId: coach.id,
            position: p.position ?? 0,
          })),
        );
      }

      if (imageReferences.length > 0) {
        await tx.insert(coachImages).values(
          imageReferences.map((ref) => ({
            coachId: coach.id,
            imageId: ref.imageId,
            position: ref.position,
          })),
        );
      }

      return coach;
    });
  },

  async updateCoachWithTransaction(
    coachId: string,
    title: string,
    headings: HeadingElement[],
    paragraphs: ParagraphElement[],
    imageReferences: { imageId: string; position: number }[],
  ): Promise<Coaches> {
    return db.transaction(async (tx) => {
      const [coach] = await tx
        .update(coaches)
        .set({ title, updatedAt: new Date() })
        .where(eq(coaches.id, coachId))
        .returning();

      await Promise.all([
        tx.delete(coachHeadings).where(eq(coachHeadings.coachId, coachId)),
        tx.delete(coachParagraphs).where(eq(coachParagraphs.coachId, coachId)),
        tx.delete(coachImages).where(eq(coachImages.coachId, coachId)),
      ]);

      if (headings.length > 0) {
        await tx.insert(coachHeadings).values(
          headings.map((h) => ({
            text: h.text,
            coachId: coach.id,
            position: h.position ?? 0,
          })),
        );
      }

      if (paragraphs.length > 0) {
        await tx.insert(coachParagraphs).values(
          paragraphs.map((p) => ({
            text: p.text,
            coachId: coach.id,
            position: p.position ?? 0,
          })),
        );
      }

      if (imageReferences.length > 0) {
        await tx.insert(coachImages).values(
          imageReferences.map((ref) => ({
            coachId: coach.id,
            imageId: ref.imageId,
            position: ref.position,
          })),
        );
      }

      return coach;
    });
  },

  async updateCoach(
    id: string,
    coach: Partial<NewCoach>,
  ): Promise<Coaches | undefined> {
    const result = await db
      .update(coaches)
      .set({ ...coach, updatedAt: new Date() })
      .where(eq(coaches.id, id))
      .returning();

    return result[0];
  },

  async deleteCoach(id: string): Promise<boolean> {
    const result = await db
      .delete(coaches)
      .where(eq(coaches.id, id))
      .returning();

    return result.length > 0;
  },
};
