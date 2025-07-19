import jwt, { SignOptions, Secret } from 'jsonwebtoken';

function getJWTSecret(): Secret {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }
  return secret;
}

export function generateToken(payload: object, expiresIn: SignOptions['expiresIn'] = '7d') {
  return jwt.sign(payload, getJWTSecret(), { expiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJWTSecret());
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}

export function isTokenValid(token: string): boolean {
  try {
    jwt.verify(token, getJWTSecret());
    return true;
  } catch (error) {
    return false;
  }
}