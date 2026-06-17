import { Request, Response, NextFunction } from 'express'
import Certificate from '../models/Certificate'
import Registration from '../models/Registration'
import AuditLog from '../models/AuditLog'
import { CertificateType } from '../types'

export const myCertificates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const certs = await Certificate.find({ user: req.user!._id })
      .populate('event', 'title date venue category')
      .sort({ createdAt: -1 })
    res.json(certs)
  } catch (err) {
    next(err)
  }
}

export const verifyByCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cert = await Certificate.findOne({ verifyCode: req.params.code, status: 'issued' })
      .populate('user', 'firstName lastName')
      .populate('event', 'title date venue')
    if (!cert) {
      res.status(404).json({ message: 'Certificate not found or not yet issued', verified: false })
      return
    }
    res.json({ verified: true, certificate: cert })
  } catch (err) {
    next(err)
  }
}

export const generate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reg = await Registration.findById(req.params.registrationId).populate('user event')
    if (!reg) {
      res.status(404).json({ message: 'Registration not found' })
      return
    }
    if (reg.status !== 'attended') {
      res.status(400).json({ message: 'Participant must be checked in before issuing a certificate' })
      return
    }

    const existing = await Certificate.findOne({ user: reg.user, event: reg.event })
    if (existing) {
      res.status(409).json({ message: 'Certificate already issued', certificate: existing })
      return
    }

    const type = (req.body.type as CertificateType) || 'Attendance'
    const cert = await Certificate.create({
      user: reg.user,
      event: reg.event,
      registration: reg._id,
      type,
      status: 'issued',
      issuedDate: new Date(),
      issuedBy: req.user!._id,
    })

    const populatedUser = reg.user as unknown as { firstName: string; lastName: string }
    const populatedEvent = reg.event as unknown as { title: string }

    await AuditLog.create({
      action: `Certificate issued: ${type} for ${populatedUser.firstName} ${populatedUser.lastName} — ${populatedEvent.title}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
    })

    res.status(201).json(cert)
  } catch (err) {
    next(err)
  }
}

export const batchGenerate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const attendees = await Registration.find({ event: req.params.eventId, status: 'attended' })
    const type = (req.body.type as CertificateType) || 'Attendance'
    let issued = 0
    let skipped = 0

    for (const reg of attendees) {
      const exists = await Certificate.findOne({ user: reg.user, event: reg.event })
      if (exists) { skipped++; continue }
      await Certificate.create({
        user: reg.user,
        event: reg.event,
        registration: reg._id,
        type,
        status: 'issued',
        issuedDate: new Date(),
        issuedBy: req.user!._id,
      })
      issued++
    }

    await AuditLog.create({
      action: `Batch certificates issued: ${issued} records (${skipped} skipped) for event ${req.params.eventId}`,
      actor: req.user!._id,
      actorName: `${req.user!.firstName} ${req.user!.lastName}`,
      actorEmail: req.user!.email,
      metadata: { eventId: req.params.eventId, issued, skipped },
    })

    res.json({ issued, skipped })
  } catch (err) {
    next(err)
  }
}

export const listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20', status } = req.query as { page?: string; limit?: string; status?: string }
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    const skip = (Number(page) - 1) * Number(limit)
    const [certs, total] = await Promise.all([
      Certificate.find(filter)
        .populate('user', 'firstName lastName email')
        .populate('event', 'title date')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Certificate.countDocuments(filter),
    ])
    res.json({ data: certs, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
}
