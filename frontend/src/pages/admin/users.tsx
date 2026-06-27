import React, { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { Users, Search, MoreVertical, CheckCircle, Clock, Ban, Filter, Loader2, X } from "lucide-react"
import { AdminLayout } from "@/components/layout"
import { PageHeader } from "@/components/dashboard"
import { NextPageWithLayout } from "@/interfaces/layout"
import { cn } from "@/utils"
import { useUsers, useUpdateUserStatus, useDeleteUser } from "@/services/hooks/users/users"
import { CARD, CARD_STYLE } from '@/utils/card-styles'

const statusStyles: Record<string, string> = {
  verified: "bg-blue-100 text-[#082F49]",
  pending: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700",
}
const statusIcon: Record<string, React.ReactNode> = {
  verified: <CheckCircle size={11} />,
  pending: <Clock size={11} />,
  suspended: <Ban size={11} />,
}

const TABS = ["All", "Verified", "Pending", "Suspended"]
const STATUS_MAP = ["", "verified", "pending", "suspended"]


const AdminUsersPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ type: 'delete' | 'suspend'; id: string; name: string; suspended?: boolean } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const { data, isLoading } = useUsers({ search: debouncedSearch || undefined, status: STATUS_MAP[tab] || undefined, limit: 50 })
  const updateStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()

  const users = data?.data ?? []
  const total = data?.total ?? 0

  const handleConfirm = async () => {
    if (!confirmModal) return
    try {
      if (confirmModal.type === 'delete') {
        await deleteUser.mutateAsync(confirmModal.id)
        toast.success("User deleted")
      } else {
        const newStatus = confirmModal.suspended ? "verified" : "suspended"
        await updateStatus.mutateAsync({ id: confirmModal.id, status: newStatus })
        toast.success(newStatus === "suspended" ? "User suspended" : "User activated")
      }
      setConfirmModal(null)
      setOpenMenuId(null)
    } catch { toast.error("Action failed") }
  }

  return (
    <div>
      <PageHeader eyebrow="User Management" title="Users" subtitle="Search, filter, and manage all registered users. Assign roles, update status, and view identity verification records." icon={<Users size={14} />} />

      <div className={CARD} style={CARD_STYLE}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors"><Filter size={14} /> Filter</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {TABS.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold border transition-colors whitespace-nowrap',
                tab === i
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background text-foreground border-input hover:bg-muted'
              )}
            >
              {label} {i === 0 ? `(${total})` : ""}
            </button>
          ))}
        </div>

        {isLoading ? <div className="py-12 text-center text-muted-foreground">Loading users...</div> : (
          <div className="w-full overflow-x-auto" ref={menuRef}>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">User</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-muted-foreground">No users match your search.</td></tr>
                ) : users.map((user) => (
                  <tr key={user._id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.state ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-border capitalize">{user.role}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize", statusStyles[user.verificationStatus])}>
                        {statusIcon[user.verificationStatus]} {user.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'super-admin' && (
                          <div className="relative">
                            <button onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                              <MoreVertical size={16} className="text-muted-foreground" />
                            </button>
                            {openMenuId === user._id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200/50 rounded-xl shadow-lg py-1 z-50 min-w-[160px]">
                                {user.verificationStatus !== "suspended" ? (
                                  <button onClick={() => { setConfirmModal({ type: 'suspend', id: user._id, name: `${user.firstName} ${user.lastName}`, suspended: false }); setOpenMenuId(null) }} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">Suspend account</button>
                                ) : (
                                  <button onClick={() => { setConfirmModal({ type: 'suspend', id: user._id, name: `${user.firstName} ${user.lastName}`, suspended: true }); setOpenMenuId(null) }} className="w-full text-left px-4 py-2 text-sm text-[#082F49] hover:bg-blue-50 transition-colors">Activate account</button>
                                )}
                                <button onClick={() => { setConfirmModal({ type: 'delete', id: user._id, name: `${user.firstName} ${user.lastName}` }); setOpenMenuId(null) }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete account</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className={`w-12 h-12 rounded-full grid place-items-center mx-auto mb-4 ${confirmModal.type === 'delete' ? 'bg-red-100' : 'bg-amber-100'}`}>
              {confirmModal.type === 'delete' ? <X size={22} className="text-red-600" /> : <Ban size={22} className="text-amber-600" />}
            </div>
            <h2 className="text-lg font-bold text-center mb-1">
              {confirmModal.type === 'delete' ? 'Delete Account?' : confirmModal.suspended ? 'Activate Account?' : 'Suspend Account?'}
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {confirmModal.type === 'delete'
                ? <><span className="font-semibold text-foreground">{confirmModal.name}</span>'s account will be permanently deleted.</>
                : confirmModal.suspended
                  ? <><span className="font-semibold text-foreground">{confirmModal.name}</span> will be able to access the platform again.</>
                  : <><span className="font-semibold text-foreground">{confirmModal.name}</span> will lose access to the platform.</>
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)} className="flex-1 h-11 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">Cancel</button>
              <button
                onClick={handleConfirm}
                disabled={deleteUser.isPending || updateStatus.isPending}
                className={`flex-1 h-11 rounded-full text-white font-bold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2 ${confirmModal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : confirmModal.suspended ? 'bg-[#082F49] hover:bg-[#061e35]' : 'bg-amber-600 hover:bg-amber-700'}`}
              >
                {(deleteUser.isPending || updateStatus.isPending) ? <Loader2 size={15} className="animate-spin" /> : confirmModal.type === 'delete' ? 'Delete' : confirmModal.suspended ? 'Activate' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

AdminUsersPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminUsersPage
