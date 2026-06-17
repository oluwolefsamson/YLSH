import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listMentors, getMentorById, getMyMentorProfile, updateMyMentorProfile,
  updateAvailability, getMyMentees, getMentorStats, requestSession,
  type UpdateMentorProfilePayload, type UpdateAvailabilityPayload,
} from '@/services/endpoints/mentors/mentors'

export const useMentors = (params?: { category?: string; page?: number; limit?: number }) =>
  useQuery({ queryKey: ['mentors', params], queryFn: () => listMentors(params) })

export const useMentor = (id: string) =>
  useQuery({ queryKey: ['mentor', id], queryFn: () => getMentorById(id), enabled: !!id })

export const useMyMentorProfile = () =>
  useQuery({ queryKey: ['mentor-profile-me'], queryFn: getMyMentorProfile })

export const useUpdateMyMentorProfile = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateMentorProfilePayload) => updateMyMentorProfile(payload),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['mentor-profile-me'] }) },
  })
}

export const useUpdateAvailability = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAvailabilityPayload) => updateAvailability(payload),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['mentor-profile-me'] }) },
  })
}

export const useMyMentees = () =>
  useQuery({ queryKey: ['mentor-mentees'], queryFn: getMyMentees })

export const useMentorStats = () =>
  useQuery({ queryKey: ['mentor-stats'], queryFn: getMentorStats })

export const useRequestSession = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ mentorId, topic, scheduledAt }: { mentorId: string; topic: string; scheduledAt: string }) =>
      requestSession(mentorId, { topic, scheduledAt }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['sessions-me'] }) },
  })
}
