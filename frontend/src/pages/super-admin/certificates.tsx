import React from 'react'
import { AdminLayout } from '@/components/layout'
import { NextPageWithLayout } from '@/interfaces/layout'
import { CertificatesContent } from '../admin/certificates'

const SuperAdminCertificatesPage: NextPageWithLayout = () => <CertificatesContent />
SuperAdminCertificatesPage.getLayout = (page) => <AdminLayout superAdmin>{page}</AdminLayout>
export default SuperAdminCertificatesPage
