import { z } from "zod";

import { protectedProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const reviewRouter = createTRPCRouter({
  createReview: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        movie_id: z.string(),
        title: z.string(),
        content: z.string(),
        rating: z.number(),
      })
    )
    .mutation(
      async ({ ctx, input: { content, movie_id, rating, title, user_id } }) => {
        return await ctx.prisma.review.create({
          data: {
            content,
            rating,
            title,
            user_id,
            movie_id,
          },
        });
      }
    ),
  deleteReview: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
				id: z.string()
      })
    )
    .mutation(async ({ ctx, input: { user_id, id } }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          id,
        },
      });
      if(review?.user_id == user_id) {
				return await ctx.prisma.review.delete({
					where: {
						id
					}
				})
			}
			return { success: false }
    }),
	updateReview: protectedProcedure
		.input(
			z.object({
				user_id: z.string(),
				id: z.string(),
				title: z.string(),
				content: z.string(),
				rating: z.number(),
			})
		).mutation(async ({ ctx, input: { content, rating, title, user_id, id } }) => {
			const review = await ctx.prisma.review.findFirst({
        where: {
          id,
        },
      });
			if(review?.user_id == user_id) {
				return await ctx.prisma.review.update({
					where: {
						id
					},
					data: {
						content,
						rating,
						title,
					}
				})
			}
			return { success: false }
		})
})