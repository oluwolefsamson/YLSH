import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User'
import AuditLog from '../models/AuditLog'
import { sendOTP, sendLoginOTP } from '../services/email.service'
import { RegisterBody, LoginBody, VerifyLoginOtpBody, JwtPayload } from '../types'

const signToken = (id: string, expiresIn = process.env.JWT_EXPIRES_IN || '7d'): string =>
  jwt.sign({ id } as JwtPayload, process.env.JWT_SECRET as string, { expiresIn } as jwt.SignOptions)

const signPreAuthToken = (id: string): string =>
  jwt.sign({ id, preAuth: true } as JwtPayload, process.env.JWT_SECRET as string, { expiresIn: '5m' } as jwt.SignOptions)

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

// POST /api/auth/send-otp  (registration email verification)
export const sendEmailOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body as { email: string }
    if (!email) {
      res.status(400).json({ message: 'Email is required' })
      return
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { emailOtp: otp, emailOtpExpires: expires },
      { upsert: true, new: true }
    )

    await sendOTP(email, otp)
    res.json({ sent: true, message: 'Verification code sent' })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/verify-otp
export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp } = req.body as { email: string; otp: string }
    const user = await User.findOne({ email: email?.toLowerCase() })

    if (!user || user.emailOtp !== otp) {
      res.status(400).json({ message: 'Invalid verification code' })
      return
    }
    if (!user.emailOtpExpires || user.emailOtpExpires < new Date()) {
      res.status(400).json({ message: 'Code has expired. Please request a new one.' })
      return
    }

    user.emailOtp = undefined
    user.emailOtpExpires = undefined
    user.emailVerified = true
    await user.save()

    res.json({ verified: true })
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
    if (existing && !existing.emailVerified) {
      res.status(400).json({ message: 'Please verify your email first' })
      return
    }
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

    // Super-admin: send OTP and return pre-auth token
    if (user.role === 'super-admin') {
      const otp = String(Math.floor(100000 + Math.random() * 900000))
      const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 min
      user.emailOtp = otp
      user.emailOtpExpires = expires
      user.lastActive = new Date()
      await user.save()

      try {
        await sendLoginOTP(user.email, otp)
      } catch {
        res.status(500).json({ message: 'Failed to send verification email. Check email configuration.' })
        return
      }
      const preAuthToken = signPreAuthToken(String(user._id))
      res.json({ requiresOtp: true, preAuthToken })
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

// POST /api/auth/verify-login-otp  (super-admin second factor)
export const verifyLoginOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { preAuthToken, otp } = req.body as VerifyLoginOtpBody

    let decoded: JwtPayload
    try {
      decoded = jwt.verify(preAuthToken, process.env.JWT_SECRET as string) as JwtPayload
    } catch {
      res.status(401).json({ message: 'Pre-auth token is invalid or expired. Please sign in again.' })
      return
    }

    if (!decoded.preAuth) {
      res.status(401).json({ message: 'Invalid token type' })
      return
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    if (user.emailOtp !== otp) {
      res.status(400).json({ message: 'Invalid verification code' })
      return
    }
    if (!user.emailOtpExpires || user.emailOtpExpires < new Date()) {
      res.status(400).json({ message: 'Verification code has expired. Please sign in again.' })
      return
    }

    user.emailOtp = undefined
    user.emailOtpExpires = undefined
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
