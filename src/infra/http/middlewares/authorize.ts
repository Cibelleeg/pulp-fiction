import type { Request, Response, NextFunction } from "express";

import type { Role } from "../../../domain/user/User.js";

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}