import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import AuditLog from '../models/AuditLog'
import { UserListQuery, CreateAdminBody } from '../types'

// GET /api/users  (admin)
export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20', search, status, role } = req.query as UserListQuery
    const filter: Record<string, unknown> = { password: { $exists: true } }
    if (status) filter.verificationStatus = status
    if (role) filter.role = role
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [data, total] = await Promise.all([
      User.find(filter).select('-password -emailOtp -emailOtpExpires').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ])
    res.json({ data, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/users/mentors/pending  (admin/super-admin)
export const listPendingMentors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20' } = req.query as { page?: string; limit?: string }
    const skip = (Number(page) - 1) * Number(limit)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { role: 'mentor', approvalStatus: 'pending' }

    const [data, total] = await Promise.all([
      User.find(filter).select('-password -emailOtp -emailOtpExpires').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ])
    res.json({ data, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/users/me  (self)
export const getMe = (req: Request, res: Response): void => {
  res.json(req.user!.toPublicJSON())
}

// GET /api/users/:id  (admin)
export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password -emailOtp -emailOtpExpires')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// PUT /api/users/me  (self)
export const updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allowed = ['firstName', 'lastName', 'phone', 'organization', 'state', 'bio', 'username', 'profilePhoto']
    const updates: Record<string, unknown> = {}
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k] })

    const user = await User.findByIdAndUpdate(req.user!._id, updates, { new: true, runValidators: true }).select('-password -emailOtp -emailOtpExpires')
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/users/:id/status  (admin)
export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body as { status: string }
    if (!['verified', 'pending', 'suspended'].includes(status)) {
      res.status(400).json({ message: 'Invalid status value' })
      return
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status },
      { new: true }
    ).select('-password -emailOtp -emailOtpExpires')

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    await AuditLog.create({
      action: `User ${status}: ${user.firstName} ${user.lastName} (${user.email})`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
      targetUser: user._id,
    })

    res.json(user)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/users/:id/approve  (admin/super-admin — approve mentor application)
export const approveMentor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    if (user.role !== 'mentor') {
      res.status(400).json({ message: 'User is not a mentor' })
      return
    }

    user.approvalStatus = 'approved'
    user.verificationStatus = 'verified'
    user.approvedBy = req.user!._id
    user.approvedAt = new Date()
    await user.save()

    await AuditLog.create({
      action: `Mentor approved: ${user.firstName} ${user.lastName} (${user.email})`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
      targetUser: user._id,
    })

    // Fire-and-forget approval email
    const { sendMentorApprovalEmail } = await import('../services/email.service')
    sendMentorApprovalEmail(user.email, user.firstName).catch(() => {})

    res.json(user.toPublicJSON())
  } catch (err) {
    next(err)
  }
}

// PATCH /api/users/:id/decline  (admin/super-admin — decline mentor application)
export const declineMentor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { note } = req.body as { note?: string }
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    if (user.role !== 'mentor') {
      res.status(400).json({ message: 'User is not a mentor' })
      return
    }

    user.approvalStatus = 'declined'
    if (note) user.approvalNote = note
    await user.save()

    await AuditLog.create({
      action: `Mentor declined: ${user.firstName} ${user.lastName} (${user.email})`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
      targetUser: user._id,
      metadata: { note },
    })

    const { sendMentorDeclineEmail } = await import('../services/email.service')
    sendMentorDeclineEmail(user.email, user.firstName, note).catch(() => {})

    res.json(user.toPublicJSON())
  } catch (err) {
    next(err)
  }
}

// PATCH /api/users/:id/role  (super-admin)
export const updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body as { role: string }
    const allowed = ['participant', 'mentor', 'admin', 'super-admin']
    if (!allowed.includes(role)) {
      res.status(400).json({ message: 'Invalid role' })
      return
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password -emailOtp -emailOtpExpires')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    await AuditLog.create({
      action: `Role changed: ${user.email} → ${role}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
      targetUser: user._id,
    })

    res.json(user)
  } catch (err) {
    next(err)
  }
}

// POST /api/users/admin  (super-admin — create admin account)
export const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password, phone } = req.body as CreateAdminBody

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: 'firstName, lastName, email, and password are required' })
      return
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      res.status(409).json({ message: 'Email already registered' })
      return
    }

    const admin = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'admin',
      emailVerified: true,
      ninVerified: true,
      verificationStatus: 'verified',
      approvalStatus: 'approved',
    })

    await AuditLog.create({
      action: `Admin account created: ${firstName} ${lastName} (${email})`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
      targetUser: admin._id,
    })

    res.status(201).json(admin.toPublicJSON())
  } catch (err) {
    next(err)
  }
}

// POST /api/users/me/change-password  (self)
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string }
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'currentPassword and newPassword are required' }); return
    }
    if (newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters' }); return
    }

    const user = await User.findById(req.user!._id)
    if (!user) { res.status(404).json({ message: 'User not found' }); return }

    const valid = await user.comparePassword(currentPassword)
    if (!valid) { res.status(400).json({ message: 'Current password is incorrect' }); return }

    user.password = newPassword
    await user.save()

    await AuditLog.create({
      action: 'PASSWORD_CHANGED',
      actor: user._id,
      actorName: user.fullName,
      actorEmail: user.email,
    })

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/users/:id  (admin)
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    await AuditLog.create({
      action: `User account deleted: ${user.email}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
    })

    res.json({ message: 'User deleted' })
  } catch (err) {
    next(err)
  }
}
