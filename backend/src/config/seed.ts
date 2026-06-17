import User from '../models/User'

export const seedSuperAdmin = async (): Promise<void> => {
  const email = process.env.SUPER_ADMIN_EMAIL
  const password = process.env.SUPER_ADMIN_PASSWORD

  if (!email || !password) {
    console.warn('[seed] SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set — skipping super-admin seed')
    return
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    if (existing.role !== 'super-admin') {
      existing.role = 'super-admin'
      existing.verificationStatus = 'verified'
      existing.approvalStatus = 'approved'
      await existing.save()
      console.log('[seed] Existing user promoted to super-admin:', email)
    }
    return
  }

  await User.create({
    firstName: process.env.SUPER_ADMIN_FIRST_NAME || 'Super',
    lastName: process.env.SUPER_ADMIN_LAST_NAME || 'Admin',
    email: email.toLowerCase(),
    password,
    role: 'super-admin',
    ninVerified: true,
    emailVerified: true,
    verificationStatus: 'verified',
    approvalStatus: 'approved',
  })

  console.log('[seed] Super-admin account created:', email)
}
