import React from 'react'
import { AdminLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'
import { LearningContent } from '../admin/learning'

const SuperAdminLearningPage: NextPageWithLayout = () => <LearningContent />
SuperAdminLearningPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminLearningPage
