import { Request, Response, NextFunction } from 'express'
import { UserRole } from '../types'

const rbac = (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }
    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({ message: 'Insufficient permissions' })
      return
    }
    next()
  }

export default rbac
