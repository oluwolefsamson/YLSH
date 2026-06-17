import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import Opportunity from '../models/Opportunity'
import Application from '../models/Application'
import AuditLog from '../models/AuditLog'
import type { OppType } from '../models/Opportunity'

// GET /api/opportunities  — public list
export const listOpportunities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, page = '1', limit = '20' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const filter: Record<string, unknown> = { isActive: true }
    if (type && type !== 'all') filter.type = type

    const [data, total] = await Promise.all([
      Opportunity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Opportunity.countDocuments(filter),
    ])

    res.json({ data, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/opportunities/:id
export const getOpportunityById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const opp = await Opportunity.findById(req.params.id).lean()
    if (!opp) { res.status(404).json({ message: 'Opportunity not found' }); return }
    res.json(opp)
  } catch (err) {
    next(err)
  }
}

// POST /api/opportunities  — admin creates
export const createOpportunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, organization, type, deadline, location, description, amount, requirements, link } = req.body as {
      title: string; organization: OppType; type: OppType; deadline: string
      location: string; description: string; amount?: string; requirements?: string; link?: string
    }

    const opp = await Opportunity.create({
      title, organization, type, deadline: new Date(deadline),
      location, description, amount, requirements, link,
      createdBy: req.user!._id,
    })

    await AuditLog.create({
      action: 'OPPORTUNITY_CREATED',
      actor: req.user!._id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      metadata: { title },
    })

    res.status(201).json(opp)
  } catch (err) {
    next(err)
  }
}

// PUT /api/opportunities/:id  — admin updates
export const updateOpportunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const opp = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!opp) { res.status(404).json({ message: 'Opportunity not found' }); return }
    res.json(opp)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/opportunities/:id  — admin deletes
export const deleteOpportunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id)
    res.json({ message: 'Opportunity deleted' })
  } catch (err) {
    next(err)
  }
}

// POST /api/opportunities/:id/apply  — participant applies
export const applyForOpportunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { coverLetter } = req.body as { coverLetter: string }
    if (!coverLetter?.trim()) { res.status(400).json({ message: 'Cover letter is required' }); return }

    const opp = await Opportunity.findById(req.params.id)
    if (!opp || !opp.isActive) { res.status(404).json({ message: 'Opportunity not found or closed' }); return }

    const existing = await Application.findOne({ opportunity: req.params.id, applicant: req.user!._id })
    if (existing) { res.status(409).json({ message: 'You have already applied for this opportunity' }); return }

    const [application] = await Application.create([{
      opportunity: new Types.ObjectId(req.params.id as string),
      applicant: req.user!._id,
      coverLetter,
    }])

    await application.populate('opportunity', 'title organization type')
    res.status(201).json(application)
  } catch (err) {
    next(err)
  }
}

// GET /api/opportunities/applications/me  — current user's applications
export const getMyApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const applications = await Application.find({ applicant: req.user!._id })
      .populate('opportunity', 'title organization type deadline location')
      .sort({ createdAt: -1 })
      .lean()
    res.json(applications)
  } catch (err) {
    next(err)
  }
}

// GET /api/opportunities/:id/applications  — admin views applications for an opportunity
export const getApplicationsForOpportunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [data, total] = await Promise.all([
      Application.find({ opportunity: req.params.id })
        .populate('applicant', 'firstName lastName email organization state')
        .skip(skip).limit(parseInt(limit)).lean(),
      Application.countDocuments({ opportunity: req.params.id }),
    ])

    res.json({ data, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/opportunities/applications/:id/status  — admin updates application status
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body as { status: string }
    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('opportunity', 'title organization')
      .populate('applicant', 'firstName lastName email')
    if (!app) { res.status(404).json({ message: 'Application not found' }); return }
    res.json(app)
  } catch (err) {
    next(err)
  }
}
