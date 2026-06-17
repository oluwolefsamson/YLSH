import { Request, Response, NextFunction } from 'express'
import Registration from '../models/Registration'
import AuditLog from '../models/AuditLog'

export const myRegistrations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const regs = await Registration.find({ user: req.user!._id })
      .populate('event', 'title date time venue category status')
      .sort({ createdAt: -1 })
    res.json(regs)
  } catch (err) {
    next(err)
  }
}

export const byEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '50' } = req.query as { page?: string; limit?: string }
    const skip = (Number(page) - 1) * Number(limit)
    const [regs, total] = await Promise.all([
      Registration.find({ event: req.params.eventId })
        .populate('user', 'firstName lastName email phone')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Registration.countDocuments({ event: req.params.eventId }),
    ])
    res.json({ data: regs, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
}

export const checkIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { qrToken } = req.body as { qrToken: string }
    const reg = await Registration.findOne({ qrToken })
      .populate('user', 'firstName lastName email')
      .populate('event', 'title date venue')

    if (!reg) {
      res.status(404).json({ message: 'QR token not found' })
      return
    }
    if (reg.status === 'attended') {
      res.status(409).json({ message: 'Already checked in', registration: reg })
      return
    }
    if (reg.status === 'waitlisted') {
      res.status(400).json({ message: 'Participant is on waitlist' })
      return
    }

    reg.status = 'attended'
    reg.checkedInAt = new Date()
    reg.checkedInBy = req.user!._id
    await reg.save()

    const populatedUser = reg.user as unknown as { firstName: string; lastName: string }
    const populatedEvent = reg.event as unknown as { title: string }

    await AuditLog.create({
      action: `Check-in: ${populatedUser.firstName} ${populatedUser.lastName} at ${populatedEvent.title}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
    })

    res.json({ message: 'Check-in successful', registration: reg })
  } catch (err) {
    next(err)
  }
}
