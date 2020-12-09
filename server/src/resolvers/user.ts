import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import type { FindConditions } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/User";
import argon2 from "argon2";
import type { MyContext } from "../types";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { sendEmail } from "../utils/sendEmail";
import { UsernamePasswordInput, UserResponse } from "../types/user";
import { buildError } from "../utils/buildError";
import { validatePassword, validateRegister } from "../validators/user";

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Ctx() { redis, req }: MyContext,
    @Arg("token") token: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    const errors = validatePassword(password);
    if (errors) {
      return { errors };
    }

    const key = FORGET_PASSWORD_PREFIX + token;

    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [buildError("token", "token expired")],
      };
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return { errors: [buildError("token", "user no longer exist")] };
    }
    user.password = await argon2.hash(password);
    await user.save();

    await redis.del(key);

    req.session!.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Ctx() { redis }: MyContext,
    @Arg("email") email: string
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      // We return true because we don't want to alert the user that this email doesn't exist
      return true;
    }
    const token = uuidv4();
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      60 * 60 * 24 * 3 // The token expire in 3 days (seconds)
    );
    const html = `<a href="http://127.0.0.1:3000/change-password/${token}">Reset your password</a>`;
    await sendEmail(email, "Forgot Password", html);
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    const userId = req.session?.userId;
    if (!userId) {
      return;
    }
    const user = await User.findOne({ where: { id: userId } });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const { username, email, password } = options;

    const existingUser = await User.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      return {
        errors: [
          buildError(
            "usernameOrEmail",
            "the username or the email already exist"
          ),
        ],
      };
    }

    errors = validatePassword(password);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(password);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    }).save();

    req.session!.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const findCondition: FindConditions<User> = usernameOrEmail.includes("@")
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail };

    const user = await User.findOne({
      where: findCondition,
    });
    if (!user) {
      return {
        errors: [buildError("usernameOrEmail", "that user doesn't exist")],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [buildError("password", "the password is not correct")],
      };
    }

    req.session!.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) => {
      req.session!.destroy((err) => {
        if (err) console.log(err);
        res.clearCookie(COOKIE_NAME);
        resolve(!err);
      });
    });
  }
}
