import { z } from "zod";

import { protectedProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const movieRouter = createTRPCRouter({
  getAllMovies: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.movie.findMany();
  }),
  createMovie: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        description: z.string(),
        name: z.string(),
        trailer: z.string(),
        genres: z.number().array(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: { user_id, description, name, trailer, genres },
      }) => {
        return await ctx.prisma.movie.create({
          data: {
            description,
            name,
            trailer,
            user_id,
            genres,
          },
        });
      }
    ),
  getMovieById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.movie.findMany({
        where: {
          id,
        },
      });
    }),
  deleteMovie: protectedProcedure
    .input(
      z.object({
        user_id: z.string(),
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input: { user_id, id } }) => {
      const movie = await ctx.prisma.movie.findFirst({
        where: {
          id,
        },
      });

      if(movie?.user_id == user_id) {
        return await ctx.prisma.movie.delete({
          where: {
            id,
          },
        });
      }
      return { success: false }
    }),
  searchMovieGenre: protectedProcedure
    .input(
      z.object({
        genre: z.number(),
      })
    )
    .query(async ({ ctx, input: { genre } }) => {
      return await ctx.prisma.movie.findMany({
        where: {
          genres: {
            has: genre,
          },
        },
      });
    }),
});
