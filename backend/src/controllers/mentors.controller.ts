import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import MentorProfile from '../models/MentorProfile'
import MentorSession from '../models/MentorSession'
import AuditLog from '../models/AuditLog'

// GET /api/mentors  — public list of approved mentors with their profiles
export const listMentors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, page = '1', limit = '20' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const userFilter: Record<string, unknown> = { role: 'mentor', approvalStatus: 'approved', verificationStatus: 'verified' }

    const mentorUsers = await User.find(userFilter).select('_id firstName lastName profilePhoto bio organization state').lean()
    const userIds = mentorUsers.map((u) => u._id)

    const profileFilter: Record<string, unknown> = { user: { $in: userIds }, isPublic: true }
    if (category && category !== 'all') profileFilter.category = category

    const total = await MentorProfile.countDocuments(profileFilter)
    const profiles = await MentorProfile.find(profileFilter)
      .populate('user', 'firstName lastName profilePhoto bio organization')
      .skip(skip)
      .limit(parseInt(limit))
      .lean()

    res.json({ data: profiles, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/mentors/:id  — single mentor public profile
export const getMentorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await MentorProfile.findOne({ user: req.params.id })
      .populate('user', 'firstName lastName profilePhoto bio organization state')
      .lean()
    if (!profile) { res.status(404).json({ message: 'Mentor not found' }); return }
    res.json(profile)
  } catch (err) {
    next(err)
  }
}

// GET /api/mentors/me/profile  — mentor's own profile
export const getMyMentorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let profile = await MentorProfile.findOne({ user: req.user!._id })
    if (!profile) {
      profile = await MentorProfile.create({ user: req.user!._id })
    }
    res.json(profile)
  } catch (err) {
    next(err)
  }
}

// PUT /api/mentors/me/profile  — update mentor's own profile
export const updateMyMentorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { headline, category, yearsExperience, bio, skills, availability, meetLink } = req.body as {
      headline?: string; category?: string; yearsExperience?: number; bio?: string
      skills?: string[]; availability?: string; meetLink?: string
    }

    let profile = await MentorProfile.findOne({ user: req.user!._id })
    if (!profile) {
      profile = await MentorProfile.create({ user: req.user!._id })
    }

    if (headline !== undefined) profile.headline = headline
    if (category !== undefined) profile.category = category
    if (yearsExperience !== undefined) profile.yearsExperience = yearsExperience
    if (bio !== undefined) {
      profile.bio = bio
      await User.findByIdAndUpdate(req.user!._id, { bio })
    }
    if (skills !== undefined) profile.skills = skills
    if (availability !== undefined) profile.availability = availability
    if (meetLink !== undefined) profile.meetLink = meetLink

    await profile.save()
    res.json(profile)
  } catch (err) {
    next(err)
  }
}

// PUT /api/mentors/me/availability  — update availability settings
export const updateAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { availableDays, startTime, endTime, sessionDuration, maxPerWeek } = req.body as {
      availableDays?: string[]; startTime?: string; endTime?: string
      sessionDuration?: number; maxPerWeek?: number
    }

    let profile = await MentorProfile.findOne({ user: req.user!._id })
    if (!profile) {
      profile = await MentorProfile.create({ user: req.user!._id })
    }

    if (availableDays !== undefined) profile.availableDays = availableDays
    if (startTime !== undefined) profile.startTime = startTime
    if (endTime !== undefined) profile.endTime = endTime
    if (sessionDuration !== undefined) profile.sessionDuration = sessionDuration
    if (maxPerWeek !== undefined) profile.maxPerWeek = maxPerWeek

    await profile.save()
    res.json(profile)
  } catch (err) {
    next(err)
  }
}

// GET /api/mentors/me/mentees  — mentor's mentees (unique mentees who had sessions)
export const getMyMentees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessions = await MentorSession.find({ mentor: req.user!._id })
      .populate('mentee', 'firstName lastName profilePhoto role organization')
      .lean()

    // group by mentee
    const menteeMap = new Map<string, { user: Record<string, unknown>; sessions: number; lastSession: Date; completed: number }>()
    for (const s of sessions) {
      const m = s.mentee as unknown as Record<string, unknown>
      const id = String((m as { _id: unknown })._id)
      if (!menteeMap.has(id)) {
        menteeMap.set(id, { user: m, sessions: 0, lastSession: s.scheduledAt, completed: 0 })
      }
      const entry = menteeMap.get(id)!
      entry.sessions++
      if (s.status === 'completed') entry.completed++
      if (s.scheduledAt > entry.lastSession) entry.lastSession = s.scheduledAt
    }

    const mentees = Array.from(menteeMap.values()).map((e) => ({
      user: e.user,
      totalSessions: e.sessions,
      completedSessions: e.completed,
      lastSession: e.lastSession,
      status: e.completed > 0 && e.sessions === e.completed ? 'completed' : 'active',
    }))

    res.json(mentees)
  } catch (err) {
    next(err)
  }
}

// GET /api/mentors/me/stats  — mentor dashboard stats
export const getMentorStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessions = await MentorSession.find({ mentor: req.user!._id }).lean()
    const uniqueMentees = new Set(sessions.map((s) => String(s.mentee))).size
    const completed = sessions.filter((s) => s.status === 'completed').length
    const thisMonth = sessions.filter((s) => {
      const d = new Date(s.scheduledAt)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length

    const profile = await MentorProfile.findOne({ user: req.user!._id }).lean()

    res.json({
      totalMentees: uniqueMentees,
      sessionsThisMonth: thisMonth,
      rating: profile?.rating ?? 0,
      totalCompleted: completed,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/mentors/:id/request  — participant requests a session with a mentor (admin creates actual session)
export const requestSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { topic, scheduledAt } = req.body as { topic: string; scheduledAt: string }
    if (!topic || !scheduledAt) { res.status(400).json({ message: 'topic and scheduledAt are required' }); return }

    const mentor = await User.findOne({ _id: req.params.id, role: 'mentor', approvalStatus: 'approved' })
    if (!mentor) { res.status(404).json({ message: 'Mentor not found' }); return }

    const profile = await MentorProfile.findOne({ user: req.params.id })
    const session = await MentorSession.create({
      mentor: req.params.id,
      mentee: req.user!._id,
      topic,
      scheduledAt: new Date(scheduledAt),
      duration: profile?.sessionDuration ?? 60,
      meetLink: profile?.meetLink ?? '',
    })

    await AuditLog.create({
      action: 'SESSION_REQUESTED',
      actor: req.user!._id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      metadata: { mentorId: req.params.id, topic },
    })

    await session.populate('mentor', 'firstName lastName profilePhoto')
    await session.populate('mentee', 'firstName lastName profilePhoto')
    res.status(201).json(session)
  } catch (err) {
    next(err)
  }
}
