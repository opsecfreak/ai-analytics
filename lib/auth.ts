import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "devsecret";

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}
