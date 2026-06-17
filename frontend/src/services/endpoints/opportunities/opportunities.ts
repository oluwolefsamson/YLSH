import { get, post, put, patch, del } from '@/services/axios'

export type OppType = 'job' | 'internship' | 'grant' | 'scholarship'
export type ApplicationStatus = 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted'

export interface Opportunity {
  _id: string
  title: string
  organization: string
  type: OppType
  deadline: string
  location: string
  description: string
  amount: string
  requirements: string
  link: string
  isActive: boolean
  createdAt: string
}

export interface Application {
  _id: string
  opportunity: Opportunity
  applicant: string
  coverLetter: string
  status: ApplicationStatus
  createdAt: string
}

export interface PaginatedOpportunities {
  data: Opportunity[]
  total: number
  page: number
  limit: number
}

export interface CreateOpportunityPayload {
  title: string
  organization: string
  type: OppType
  deadline: string
  location: string
  description: string
  amount?: string
  requirements?: string
  link?: string
}

export const listOpportunities = (params?: { type?: string; page?: number; limit?: number }) =>
  get<PaginatedOpportunities>('/api/opportunities', params)

export const getOpportunityById = (id: string) => get<Opportunity>(`/api/opportunities/${id}`)

export const createOpportunity = (payload: CreateOpportunityPayload) =>
  post<Opportunity>('/api/opportunities', payload)

export const updateOpportunity = (id: string, payload: Partial<CreateOpportunityPayload>) =>
  put<Opportunity>(`/api/opportunities/${id}`, payload)

export const deleteOpportunity = (id: string) => del<{ message: string }>(`/api/opportunities/${id}`)

export const applyForOpportunity = (id: string, coverLetter: string) =>
  post<Application>(`/api/opportunities/${id}/apply`, { coverLetter })

export const getMyApplications = () => get<Application[]>('/api/opportunities/applications/me')

export const updateApplicationStatus = (id: string, status: ApplicationStatus) =>
  patch<Application>(`/api/opportunities/applications/${id}/status`, { status })
