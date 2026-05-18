import jwt from "jsonwebtoken";
import type { Response } from "express";

interface GenerateAccessTokenParams {
  id: string;
  res: Response;
}

export const generateAccessToken = ({id, res}: GenerateAccessTokenParams) => {
  const payload = { id };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};
