import { SignJWT, jwtVerify } from "jose"

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error(
      "CRITICAL CONFIG ERROR: JWT_SECRET environment variable is missing or empty. Please set JWT_SECRET in your environment configuration."
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signStudentToken(studentId: string, roomId: string) {
  const secret = getJwtSecret()
  return new SignJWT({ studentId, roomId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyStudentToken(token: string) {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)
    return payload as { studentId: string; roomId: string; [key: string]: any }
  } catch (error) {
    return null
  }
}
