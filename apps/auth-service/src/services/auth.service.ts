import { AppError } from "shared";
import { createUser, findByEmail, findById } from "../repositories/user.repository";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils";
import { signToken } from "../utils/jwt";

export async function register(input: RegisterInput) {
  const isUserExisting = await findByEmail(input.email);

  if (isUserExisting) {
    throw new AppError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const newUser = await createUser({
    name: input.name,
    email: input.email,
    passwordHash: hashedPassword,
    role: "USER",
  });

  return convertToPublicUser(newUser);
}

export async function login(input: LoginInput) {
  const isUserExisting = await findByEmail(input.email);

  if (!isUserExisting) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    isUserExisting.password_hash,
  );

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const userToken = signToken({
    userId: isUserExisting.id,
    role: isUserExisting.role,
  });

  return {
    userToken,
    user: convertToPublicUser(isUserExisting),
  };
}

export async function getMe(userId: string) {
  const currentUser = await findById(userId);

  if (!currentUser) {
    throw new AppError(404, "User not found");
  }

  return convertToPublicUser(currentUser);
}
