import { Request, Response, NextFunction } from 'express'
import LearningResource, { ResourceType } from '../models/LearningResource'
import UserProgress from '../models/UserProgress'
import AuditLog from '../models/AuditLog'

// GET /api/learning  — list resources with user progress merged in
export const listResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, category, page = '1', limit = '50' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const filter: Record<string, unknown> = { isPublic: true }
    if (type) filter.type = type
    if (category) filter.category = category

    const [resources, total] = await Promise.all([
      LearningResource.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      LearningResource.countDocuments(filter),
    ])

    // merge in user progress if authenticated
    let progressMap: Map<string, { progress: number; completed: boolean }> = new Map()
    if (req.user) {
      const progressRecords = await UserProgress.find({
        user: req.user._id,
        resource: { $in: resources.map((r) => r._id) },
      }).lean()
      progressMap = new Map(progressRecords.map((p) => [String(p.resource), { progress: p.progress, completed: p.completed }]))
    }

    const enriched = resources.map((r) => {
      const prog = progressMap.get(String(r._id))
      return { ...r, progress: prog?.progress ?? 0, completed: prog?.completed ?? false }
    })

    res.json({ data: enriched, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) {
    next(err)
  }
}

// GET /api/learning/:id
export const getResourceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resource = await LearningResource.findById(req.params.id).lean()
    if (!resource) { res.status(404).json({ message: 'Resource not found' }); return }

    let progress = 0
    let completed = false
    if (req.user) {
      const prog = await UserProgress.findOne({ user: req.user._id, resource: req.params.id }).lean()
      progress = prog?.progress ?? 0
      completed = prog?.completed ?? false
    }

    res.json({ ...resource, progress, completed })
  } catch (err) {
    next(err)
  }
}

// POST /api/learning  — admin creates resource
export const createResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, type, category, duration, url, videoId, excerpt } = req.body as {
      title: string; type: 'video' | 'pdf' | 'article'; category: string; duration?: string
      url?: string; videoId?: string; excerpt?: string
    }

    const resource = await LearningResource.create({
      title, type: type as ResourceType, category, duration, url, videoId, excerpt,
      createdBy: req.user!._id,
    })

    await AuditLog.create({
      action: 'LEARNING_RESOURCE_CREATED',
      actor: req.user!._id,
      actorName: req.user!.fullName,
      actorEmail: req.user!.email,
      metadata: { title, type },
    })

    res.status(201).json(resource)
  } catch (err) {
    next(err)
  }
}

// PUT /api/learning/:id  — admin updates
export const updateResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resource = await LearningResource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!resource) { res.status(404).json({ message: 'Resource not found' }); return }
    res.json(resource)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/learning/:id  — admin deletes
export const deleteResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await LearningResource.findByIdAndDelete(req.params.id)
    await UserProgress.deleteMany({ resource: req.params.id })
    res.json({ message: 'Resource deleted' })
  } catch (err) {
    next(err)
  }
}

// POST /api/learning/:id/progress  — update progress for current user
export const updateProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { progress } = req.body as { progress: number }
    if (progress === undefined || progress < 0 || progress > 100) {
      res.status(400).json({ message: 'progress must be 0–100' }); return
    }

    const completed = progress >= 100
    const record = await UserProgress.findOneAndUpdate(
      { user: req.user!._id, resource: req.params.id },
      { progress, completed, lastAccessedAt: new Date() },
      { upsert: true, new: true }
    )

    res.json(record)
  } catch (err) {
    next(err)
  }
}
