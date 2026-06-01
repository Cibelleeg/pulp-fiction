import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import type { Role } from '../../../domain/user/User.js'
import { config } from '../../../config.js'

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as unknown as { id: number, role: Role }

        req.user = { id: decoded.id, role: decoded.role }
        next()
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' })
    }
}
