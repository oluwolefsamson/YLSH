import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import Event from '../models/Event'
import Registration from '../models/Registration'
import Certificate from '../models/Certificate'
import AuditLog from '../models/AuditLog'

export const dashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalUsers, verifiedUsers, activeEvents, totalCertificates,
      newUsersThisMonth, newVerificationsThisMonth, newCertificatesThisMonth,
      totalAttendance, pendingMentors,
    ] = await Promise.all([
      User.countDocuments({ password: { $exists: true } }),
      User.countDocuments({ ninVerified: true, password: { $exists: true } }),
      Event.countDocuments({ status: 'upcoming' }),
      Certificate.countDocuments({ status: 'issued' }),
      User.countDocuments({ createdAt: { $gte: startOfMonth }, password: { $exists: true } }),
      User.countDocuments({ ninVerified: true, updatedAt: { $gte: startOfMonth } }),
      Certificate.countDocuments({ status: 'issued', issuedDate: { $gte: startOfMonth } }),
      Registration.countDocuments({ status: 'attended' }),
      User.countDocuments({ role: 'mentor', approvalStatus: 'pending' }),
    ])

    res.json({
      totalUsers,
      verifiedUsers,
      activeEvents,
      totalCertificates,
      totalAttendance,
      pendingMentors,
      growth: {
        newUsers: newUsersThisMonth,
        newVerifications: newVerificationsThisMonth,
        newCertificates: newCertificatesThisMonth,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const userGrowth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const months: Array<{ year: number; month: number }> = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      months.push({ year: d.getFullYear(), month: d.getMonth() })
    }

    const growth = await Promise.all(
      months.map(async ({ year, month }) => {
        const start = new Date(year, month, 1)
        const end = new Date(year, month + 1, 1)
        const count = await User.countDocuments({ createdAt: { $lt: end }, password: { $exists: true } })
        return {
          month: start.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
          count,
        }
      })
    )
    res.json(growth)
  } catch (err) {
    next(err)
  }
}

export const eventStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const events = await Event.find().select('title capacity registeredCount date').sort({ date: -1 }).limit(10)

    const withAttendance = await Promise.all(
      events.map(async (e) => {
        const attendees = await Registration.countDocuments({ event: e._id, status: 'attended' })
        const certificates = await Certificate.countDocuments({ event: e._id, status: 'issued' })
        return { title: e.title, capacity: e.capacity, registered: e.registeredCount, attendees, certificates }
      })
    )

    res.json(withAttendance)
  } catch (err) {
    next(err)
  }
}

export const auditLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20' } = req.query as { page?: string; limit?: string }
    const skip = (Number(page) - 1) * Number(limit)
    const [logs, total] = await Promise.all([
      AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      AuditLog.countDocuments(),
    ])
    res.json({ data: logs, total, page: Number(page), limit: Number(limit) })
  } catch (err) {
    next(err)
  }
}
