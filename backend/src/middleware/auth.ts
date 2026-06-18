import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { JwtPayload } from '../types'

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' })
    return
  }

  const token = header.slice(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authMiddleware
