import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await Post.find();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
  }

  @Mutation(() => Post)
  createPost(@Arg("title") title: string): Promise<Post> {
    return Post.create({ title }).save();
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
