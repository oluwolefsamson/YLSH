import { Request, Response, NextFunction } from 'express'
import Volunteer from '../models/Volunteer'
import AuditLog from '../models/AuditLog'
import { VolunteerStatus } from '../types'

export const apply = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId, role } = req.body as { eventId: string; role?: string }
    const existing = await Volunteer.findOne({ user: req.user!._id, event: eventId })
    if (existing) {
      res.status(409).json({ message: 'Already applied to volunteer for this event' })
      return
    }
    const vol = await Volunteer.create({ user: req.user!._id, event: eventId, role })
    res.status(201).json(vol)
  } catch (err) {
    next(err)
  }
}

export const byEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vols = await Volunteer.find({ event: req.params.eventId })
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
    res.json(vols)
  } catch (err) {
    next(err)
  }
}

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body as { status: VolunteerStatus }
    const vol = await Volunteer.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'firstName lastName')
    if (!vol) {
      res.status(404).json({ message: 'Volunteer record not found' })
      return
    }

    const populatedUser = vol.user as unknown as { firstName: string; lastName: string }
    await AuditLog.create({
      action: `Volunteer ${status}: ${populatedUser.firstName} ${populatedUser.lastName}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
    })
    res.json(vol)
  } catch (err) {
    next(err)
  }
}

export const myVolunteerRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vols = await Volunteer.find({ user: req.user!._id })
      .populate('event', 'title date venue')
    res.json(vols)
  } catch (err) {
    next(err)
  }
}
