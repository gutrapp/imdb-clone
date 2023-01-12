import { createTRPCRouter } from "./trpc";
import { movieRouter } from "../api/routers/movie"
import { commentRouter } from "../api/routers/comment"
import { reviewRouter } from "../api/routers/review"

export const appRouter = createTRPCRouter({
    comment: commentRouter,
    movie: movieRouter,
    review: reviewRouter
});

export type AppRouter = typeof appRouter;
