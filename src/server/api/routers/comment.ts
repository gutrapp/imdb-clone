import { z } from "zod";

import { protectedProcedure, createTRPCRouter } from "../trpc";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        review_id: z.string(),
        content: z.string(),
      })
    )
    .mutation(
      async ({ ctx, input: { content, review_id, user_id } }) => {
        return await ctx.prisma.comment.create({
          data: {
            content,
            user_id,
            review_id,
          },
        });
      }
    ),
  deleteComment: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
				id: z.string()
      })
    )
    .mutation(async ({ ctx, input: { user_id, id } }) => {
      const review = await ctx.prisma.comment.findFirst({
        where: {
          id,
        },
      });
      if(review?.user_id == user_id) {
				return await ctx.prisma.comment.delete({
					where: {
						id
					}
				})
			}
			return { success: false }
    }),
	updateComment: protectedProcedure
		.input(
			z.object({
				user_id: z.string(),
				id: z.string(),
				content: z.string(),
			})
		).mutation(async ({ ctx, input: { content, user_id, id } }) => {
			const review = await ctx.prisma.comment.findFirst({
        where: {
          id,
        },
      });
			if(review?.user_id == user_id) {
				return await ctx.prisma.comment.update({
					where: {
						id
					},
					data: {
						content,
					}
				})
			}
			return { success: false }
		})
});
