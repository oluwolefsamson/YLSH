import { Request, Response, NextFunction } from 'express'
import Event from '../models/Event'
import Registration from '../models/Registration'
import AuditLog from '../models/AuditLog'

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, category, page = '1', limit = '20' } = req.query as Record<string, string>
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (category) filter.category = category

    const skip = (Number(page) - 1) * Number(limit)
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip(skip).limit(Number(limit)).populate('speakers', 'name photo topic'),
      Event.countDocuments(filter),
    ])
    res.json({ data: events, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
}

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).populate('speakers')
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }
    res.json(event)
  } catch (err) {
    next(err)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user!._id })
    await AuditLog.create({
      action: `Event created: ${event.title}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
    })
    res.status(201).json(event)
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }
    await AuditLog.create({
      action: `Event updated: ${event.title}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
    })
    res.json(event)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }
    await AuditLog.create({
      action: `Event deleted: ${event.title}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
    })
    res.json({ message: 'Event deleted' })
  } catch (err) {
    next(err)
  }
}

export const registerForEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      res.status(404).json({ message: 'Event not found' })
      return
    }
    const existing = await Registration.findOne({ user: req.user!._id, event: event._id })
    if (existing) {
      res.status(409).json({ message: 'Already registered for this event', registration: existing })
      return
    }

    const status = event.registeredCount >= event.capacity ? 'waitlisted' : 'registered'
    const registration = await Registration.create({ user: req.user!._id, event: event._id, status })

    if (status === 'registered') {
      event.registeredCount += 1
      await event.save()
    }
    res.status(201).json({ registration, status })
  } catch (err) {
    next(err)
  }
}

export const cancelRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reg = await Registration.findOneAndDelete({ user: req.user!._id, event: req.params.id })
    if (!reg) {
      res.status(404).json({ message: 'Registration not found' })
      return
    }
    if (reg.status === 'registered') {
      await Event.findByIdAndUpdate(req.params.id, { $inc: { registeredCount: -1 } })
    }
    res.json({ message: 'Registration cancelled' })
  } catch (err) {
    next(err)
  }
}
