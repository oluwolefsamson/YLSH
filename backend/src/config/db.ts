import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/ylsh')
    console.log('MongoDB connected')
  } catch (err: unknown) {
    console.error('MongoDB connection error:', (err as Error).message)
    process.exit(1)
  }
}

export default connectDB
