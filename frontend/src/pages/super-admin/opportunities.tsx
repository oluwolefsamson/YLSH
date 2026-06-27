import React from 'react'
import { AdminLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'
import { OpportunitiesContent } from '../admin/opportunities'

const SuperAdminOpportunitiesPage: NextPageWithLayout = () => <OpportunitiesContent />
SuperAdminOpportunitiesPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminOpportunitiesPage
