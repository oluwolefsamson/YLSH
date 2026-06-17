import { post, get } from '@/services/axios'

export interface AuthUser {
  _id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  role: 'participant' | 'mentor' | 'admin' | 'super-admin'
  verificationStatus: 'verified' | 'pending' | 'suspended'
  approvalStatus: 'pending' | 'approved' | 'declined'
  approvalNote?: string
  ninVerified: boolean
  emailVerified: boolean
  organization?: string
  state?: string
  bio?: string
  phone?: string
  username?: string
  profilePhoto?: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

// Super-admin login returns this before OTP is verified
export interface LoginOtpRequired {
  requiresOtp: true
  preAuthToken: string
}

export type LoginResponse = LoginOtpRequired | AuthResponse

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone?: string
  organization?: string
  nin: string
  role: string
  username?: string
  password: string
}

export const verifyNIN = (nin: string) =>
  post<{ verified: boolean; message: string }>('/api/auth/verify-nin', { nin })

export const sendOTP = (email: string) =>
  post<{ sent: boolean; message: string }>('/api/auth/send-otp', { email })

export const verifyOTP = (email: string, otp: string) =>
  post<{ verified: boolean }>('/api/auth/verify-otp', { email, otp })

export const register = (payload: RegisterPayload) =>
  post<AuthResponse>('/api/auth/register', payload)

export const login = (email: string, password: string) =>
  post<LoginResponse>('/api/auth/login', { email, password })

export const loginVerifyOtp = (preAuthToken: string, otp: string) =>
  post<AuthResponse>('/api/auth/verify-login-otp', { preAuthToken, otp })

export const logout = () => post<{ message: string }>('/api/auth/logout')

export const getMe = () => get<{ user: AuthUser }>('/api/auth/me')
