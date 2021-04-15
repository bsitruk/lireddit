import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getRepository, getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { isAuth } from "../middlewares/isAuth";
import { MyContext } from "../types";
import { PaginatedPosts, PostInput } from "../types/post";

@Resolver(() => Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post): string {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const userId = req.session?.userId;
    const updoot = Updoot.create({
      userId,
      postId,
      value: realValue,
    });
    await getConnection().transaction(async (manager) => {
      await manager.save(updoot);
      await manager.increment(Post, { id: postId }, "points", realValue);
    });
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => Int, { nullable: true }) cursor: number | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit) + 1;
    const qb = getRepository(Post)
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.author", "author")
      .orderBy("p.id", "DESC")
      .take(realLimit);
    if (cursor) {
      qb.where("p.id < :cursor", { cursor });
    }

    const posts = await qb.getMany();
    const hasMore = posts.length === realLimit;
    if (hasMore) posts.pop();

    return { posts, hasMore };
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      authorId: req.session!.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    if (!post) return;
    post.title = title;
    await post.save();
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id", () => Int) id: number): Promise<boolean> {
    const post = await Post.findOne(id);
    if (!post) return false;
    await post.remove();
    return true;
  }
}
