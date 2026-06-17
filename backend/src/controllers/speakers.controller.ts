import { Request, Response, NextFunction } from 'express'
import Speaker from '../models/Speaker'

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const speakers = await Speaker.find().sort({ name: 1 })
    res.json(speakers)
  } catch (err) {
    next(err)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const speaker = await Speaker.create(req.body)
    res.status(201).json(speaker)
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const speaker = await Speaker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!speaker) {
      res.status(404).json({ message: 'Speaker not found' })
      return
    }
    res.json(speaker)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Speaker.findByIdAndDelete(req.params.id)
    res.json({ message: 'Speaker removed' })
  } catch (err) {
    next(err)
  }
}
