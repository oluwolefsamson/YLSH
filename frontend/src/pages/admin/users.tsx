import React, { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { Users, Search, MoreVertical, CheckCircle, Clock, Ban, Filter } from "lucide-react"
import { AdminLayout } from "@/components/layout"
import { PageHeader } from "@/components/dashboard"
import { NextPageWithLayout } from "@/interfaces/layout"
import { cn } from "@/utils"
import { useUsers, useUpdateUserStatus, useDeleteUser } from "@/services/hooks/users/users"

const statusStyles: Record<string, string> = {
  verified: "bg-green-100 text-green-700",
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

const CARD = "p-5 md:p-6 rounded-2xl backdrop-blur-sm border border-slate-200/16"
const CARD_STYLE = { backgroundColor: "rgba(255,255,255,0.88)", boxShadow: "0 12px 30px rgba(15,23,42,0.06)" }

const AdminUsersPage: NextPageWithLayout = () => {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
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

  const handleSuspend = async (id: string) => {
    try { await updateStatus.mutateAsync({ id, status: "suspended" }); toast.success("User suspended"); setOpenMenuId(null) }
    catch { toast.error("Failed to suspend user") }
  }

  const handleActivate = async (id: string) => {
    try { await updateStatus.mutateAsync({ id, status: "verified" }); toast.success("User activated"); setOpenMenuId(null) }
    catch { toast.error("Failed to activate user") }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return
    try { await deleteUser.mutateAsync(id); toast.success("User deleted"); setOpenMenuId(null) }
    catch { toast.error("Failed to delete user") }
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

        <div className="flex gap-1 border-b border-slate-200/18 mb-5">
          {TABS.map((label, i) => (
            <button key={label} onClick={() => setTab(i)} className={cn("px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors whitespace-nowrap", tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {label} {i === 0 ? `(${total})` : ""}
            </button>
          ))}
        </div>

        {isLoading ? <div className="py-12 text-center text-muted-foreground">Loading users...</div> : (
          <div className="flex flex-col gap-3" ref={menuRef}>
            {users.map((user) => (
              <div key={user._id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/18 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.email} · {user.state ?? "—"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-border capitalize">{user.role}</span>
                    <span className="text-xs text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize", statusStyles[user.verificationStatus])}>
                    {statusIcon[user.verificationStatus]} {user.verificationStatus}
                  </span>
                  {user.role !== 'super-admin' && (
                    <div className="relative">
                      <button onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                        <MoreVertical size={16} className="text-muted-foreground" />
                      </button>
                      {openMenuId === user._id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200/50 rounded-xl shadow-lg py-1 z-50 min-w-[160px]">
                          {user.verificationStatus !== "suspended" ? (
                            <button onClick={() => handleSuspend(user._id)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">Suspend account</button>
                          ) : (
                            <button onClick={() => handleActivate(user._id)} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors">Activate account</button>
                          )}
                          <button onClick={() => handleDelete(user._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete account</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {users.length === 0 && <div className="py-12 text-center text-muted-foreground">No users match your search.</div>}
          </div>
        )}
      </div>
    </div>
  )
}

AdminUsersPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>
export default AdminUsersPage
