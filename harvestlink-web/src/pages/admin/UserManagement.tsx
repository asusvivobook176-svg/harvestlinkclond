import { useState } from "react";
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical, 
    UserPlus, 
    Shield, 
    UserCheck, 
    UserX, 
    Mail, 
    Phone, 
    CheckCircle2, 
    XCircle, 
    Clock 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { formatDate, cn } from "../../lib/utils";

const mockUsers = [
    { id: "u1", name: "Ravi Kumar", email: "ravi@example.com", role: "farmer", status: "active", joined: "2026-01-15", phone: "+91 98765 43210" },
    { id: "u2", name: "Salem Traders", email: "contact@salemtraders.com", role: "shop", status: "active", joined: "2026-02-10", phone: "+91 87654 32109" },
    { id: "u3", name: "Anish S.", email: "anish@example.com", role: "admin", status: "active", joined: "2025-12-01", phone: "+91 76543 21098" },
    { id: "u4", name: "Selvam M.", email: "selvam@example.com", role: "farmer", status: "suspended", joined: "2026-03-01", phone: "+91 65432 10987" },
];

export default function UserManagement() {
    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const toggleStatus = (id: string) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
        ));
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
                                <Users className="w-4 h-4" />
                                <span>Identity Management</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Directory</h1>
                            <p className="text-slate-500 font-medium">Manage permissions and account status for all roles.</p>
                        </div>

                        <button className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 transition-all">
                            <UserPlus className="w-5 h-5" />
                            <span>Add New User</span>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email or ID..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="pl-4 pr-10 py-3 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="farmer">Farmers</option>
                                <option value="shop">Traders</option>
                                <option value="admin">Admins</option>
                            </select>
                            <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <tr>
                                        <th className="px-8 py-5">User Profile</th>
                                        <th className="px-8 py-5">Role/Permission</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Joined Date</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence>
                                        {filteredUsers.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-slate-50/50 transition-all group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black",
                                                            user.role === 'admin' ? 'bg-rose-50 text-rose-600' : 
                                                            user.role === 'shop' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                                        )}>
                                                            {user.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                                                <Mail className="w-3 h-3" /> {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit",
                                                            user.role === 'admin' ? 'bg-rose-50 text-rose-600' : 
                                                            user.role === 'shop' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                                        )}>
                                                            {user.role}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold">{user.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        {user.status === 'active' ? (
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-rose-500" />
                                                        )}
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest",
                                                            user.status === 'active' ? 'text-emerald-600' : 'text-rose-600'
                                                        )}>
                                                            {user.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                        <Clock className="w-4 h-4 text-slate-300" />
                                                        {formatDate(user.joined)}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => toggleStatus(user.id)}
                                                            className={cn(
                                                                "p-2.5 rounded-xl transition-all",
                                                                user.status === 'active' ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'
                                                            )}
                                                            title={user.status === 'active' ? "Suspend User" : "Activate User"}
                                                        >
                                                            {user.status === 'active' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                                                        </button>
                                                        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                            <Shield className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
