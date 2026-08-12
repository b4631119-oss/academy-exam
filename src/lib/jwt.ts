import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_key_change_me_in_production"
)

export async function signStudentToken(studentId: string, roomId: string) {
  return new SignJWT({ studentId, roomId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyStudentToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { studentId: string; roomId: string; [key: string]: any }
  } catch (error) {
    return null
  }
}
