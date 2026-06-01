import type { Role } from "../../domain/user/User.js"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        role: Role
      }
    }
  }
}
