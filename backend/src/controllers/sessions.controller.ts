import { Request, Response, NextFunction } from 'express'
import MentorSession from '../models/MentorSession'
import MentorProfile from '../models/MentorProfile'

// GET /api/sessions/me  — sessions for current user (mentor or mentee)
export const getMySessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id
    const role = req.user!.role

    const filter = role === 'mentor'
      ? { mentor: userId }
      : { mentee: userId }

    const sessions = await MentorSession.find(filter)
      .populate('mentor', 'firstName lastName profilePhoto organization')
      .populate('mentee', 'firstName lastName profilePhoto')
      .sort({ scheduledAt: -1 })
      .lean()

    res.json(sessions)
  } catch (err) {
    next(err)
  }
}

// GET /api/sessions/:id
export const getSessionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await MentorSession.findById(req.params.id)
      .populate('mentor', 'firstName lastName profilePhoto organization')
      .populate('mentee', 'firstName lastName profilePhoto')
      .lean()
    if (!session) { res.status(404).json({ message: 'Session not found' }); return }
    res.json(session)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/sessions/:id/status  — mentor cancels or admin updates
export const updateSessionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, outcome } = req.body as { status?: string; outcome?: string }
    const session = await MentorSession.findById(req.params.id)
    if (!session) { res.status(404).json({ message: 'Session not found' }); return }

    const isMentor = String(session.mentor) === String(req.user!._id)
    const isMentee = String(session.mentee) === String(req.user!._id)
    const isAdmin = ['admin', 'super-admin'].includes(req.user!.role)

    if (!isMentor && !isMentee && !isAdmin) {
      res.status(403).json({ message: 'Not authorized' }); return
    }

    if (status) session.status = status as 'scheduled' | 'completed' | 'cancelled'
    if (outcome !== undefined) session.outcome = outcome

    // update mentor profile total sessions count
    if (status === 'completed') {
      await MentorProfile.findOneAndUpdate(
        { user: session.mentor },
        { $inc: { totalSessions: 1 } }
      )
    }

    await session.save()
    await session.populate('mentor', 'firstName lastName profilePhoto organization')
    await session.populate('mentee', 'firstName lastName profilePhoto')
    res.json(session)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/sessions/:id/outcome  — mentor adds outcome after session
export const addOutcome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { outcome } = req.body as { outcome: string }
    const session = await MentorSession.findById(req.params.id)
    if (!session) { res.status(404).json({ message: 'Session not found' }); return }

    if (String(session.mentor) !== String(req.user!._id)) {
      res.status(403).json({ message: 'Only the mentor can add an outcome' }); return
    }

    session.outcome = outcome
    await session.save()
    res.json(session)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/sessions/:id  — cancel (mentor or mentee)
export const cancelSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await MentorSession.findById(req.params.id)
    if (!session) { res.status(404).json({ message: 'Session not found' }); return }

    const isMentor = String(session.mentor) === String(req.user!._id)
    const isMentee = String(session.mentee) === String(req.user!._id)
    if (!isMentor && !isMentee) { res.status(403).json({ message: 'Not authorized' }); return }

    session.status = 'cancelled'
    await session.save()
    res.json({ message: 'Session cancelled' })
  } catch (err) {
    next(err)
  }
}

// POST /api/sessions/:id/rate  — mentee rates a completed session
export const rateSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rating } = req.body as { rating: number }
    if (!rating || rating < 1 || rating > 5) { res.status(400).json({ message: 'Rating must be between 1 and 5' }); return }

    const session = await MentorSession.findById(req.params.id)
    if (!session) { res.status(404).json({ message: 'Session not found' }); return }
    if (String(session.mentee) !== String(req.user!._id)) { res.status(403).json({ message: 'Only the mentee can rate' }); return }
    if (session.status !== 'completed') { res.status(400).json({ message: 'Can only rate completed sessions' }); return }

    session.rating = rating
    await session.save()

    // recompute mentor average rating
    const sessions = await MentorSession.find({ mentor: session.mentor, rating: { $ne: null } }).lean()
    const avg = sessions.reduce((sum, s) => sum + (s.rating ?? 0), 0) / sessions.length
    await MentorProfile.findOneAndUpdate({ user: session.mentor }, { rating: Math.round(avg * 10) / 10 })

    res.json(session)
  } catch (err) {
    next(err)
  }
}
