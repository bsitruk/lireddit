import { Entity, Column, BaseEntity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

// A User can vote for many Posts
// A Post can have votes from many Users
// User -> Updoot <- Post (Many to Many)

@Entity()
export class Updoot extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  postId!: number;

  @Column({ type: "int" })
  value!: number;

  @ManyToOne(() => User, (user) => user.updoots)
  user!: User;

  @ManyToOne(() => Post, (post) => post.updoots)
  post!: Post;
}
