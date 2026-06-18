import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import AuditLog from '../models/AuditLog'
import { RegisterBody, LoginBody, JwtPayload } from '../types'

const signToken = (id: string, expiresIn = process.env.JWT_EXPIRES_IN || '7d'): string =>
  jwt.sign({ id } as JwtPayload, process.env.JWT_SECRET as string, { expiresIn } as jwt.SignOptions)

// POST /api/auth/verify-nin
export const verifyNIN = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nin } = req.body as { nin: string }
    if (!nin || !/^\d{11}$/.test(nin.trim())) {
      res.status(400).json({ message: 'NIN must be exactly 11 digits' })
      return
    }
    const existing = await User.findOne({ nin: nin.trim(), ninVerified: true })
    if (existing) {
      res.status(409).json({ message: 'NIN already registered' })
      return
    }
    res.json({ verified: true, message: 'NIN format valid' })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, organization, nin, role, username, password } =
      req.body as RegisterBody

    const existing = await User.findOne({ email: email?.toLowerCase() })
    if (existing && existing.password && existing.firstName) {
      res.status(409).json({ message: 'Email already registered' })
      return
    }

    const allowedRoles = ['participant', 'mentor']
    const assignedRole = allowedRoles.includes(role?.toLowerCase() || '') ? role!.toLowerCase() : 'participant'
    const isMentor = assignedRole === 'mentor'

    const user = existing || new User()
    user.firstName = firstName
    user.lastName = lastName
    user.email = email.toLowerCase()
    user.phone = phone
    user.organization = organization
    user.nin = nin
    user.ninVerified = true
    user.emailVerified = true
    user.role = assignedRole as 'participant' | 'mentor'
    user.username = username
    user.password = password
    user.verificationStatus = isMentor ? 'pending' : 'verified'
    user.approvalStatus = isMentor ? 'pending' : 'approved'

    await user.save()

    await AuditLog.create({
      action: isMentor
        ? `New mentor application: ${firstName} ${lastName} — pending approval`
        : `New ${assignedRole} registered: ${firstName} ${lastName}`,
      actorName: `${firstName} ${lastName}`,
      actorEmail: email,
    })

    const token = signToken(String(user._id))
    res.status(201).json({ token, user: user.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody
    const user = await User.findOne({ email: email?.toLowerCase() })

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }
    if (user.verificationStatus === 'suspended') {
      res.status(403).json({ message: 'Your account has been suspended' })
      return
    }

    user.lastActive = new Date()
    await user.save()

    const token = signToken(String(user._id))
    res.json({ token, user: user.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export const me = (req: Request, res: Response): void => {
  res.json({ user: req.user!.toPublicJSON() })
}

// POST /api/auth/logout
export const logout = (_req: Request, res: Response): void => {
  res.json({ message: 'Logged out' })
}
