import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import connectDB from './config/db'
import { seedSuperAdmin } from './config/seed'

import authRoutes from './routes/auth.routes'
import userRoutes from './routes/users.routes'
import eventRoutes from './routes/events.routes'
import registrationRoutes from './routes/registrations.routes'
import certificateRoutes from './routes/certificates.routes'
import analyticsRoutes from './routes/analytics.routes'
import speakerRoutes from './routes/speakers.routes'
import volunteerRoutes from './routes/volunteers.routes'
import mentorRoutes from './routes/mentors.routes'
import sessionRoutes from './routes/sessions.routes'
import opportunityRoutes from './routes/opportunities.routes'
import learningRoutes from './routes/learning.routes'

const app = express()
const PORT = process.env.PORT || 8000

const bootstrap = async () => {
  await connectDB()
  await seedSuperAdmin()

  app.use(helmet())
  app.use(cors({ origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:3001', 'https://ylsh-ptjm.vercel.app'], credentials: true }))
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok', ts: new Date().toISOString() }))

  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/events', eventRoutes)
  app.use('/api/registrations', registrationRoutes)
  app.use('/api/certificates', certificateRoutes)
  app.use('/api/analytics', analyticsRoutes)
  app.use('/api/speakers', speakerRoutes)
  app.use('/api/volunteers', volunteerRoutes)
  app.use('/api/mentors', mentorRoutes)
  app.use('/api/sessions', sessionRoutes)
  app.use('/api/opportunities', opportunityRoutes)
  app.use('/api/learning', learningRoutes)

  app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack)
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
  })

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

bootstrap().catch((err) => {
  console.error('Failed to start:', err)
  process.exit(1)
})
