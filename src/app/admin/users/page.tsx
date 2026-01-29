'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Search, Mail, Fingerprint, DollarSign, ChevronRight, Loader2, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import api from '../../../lib/axios';
import Image from 'next/image';

interface AdminUser {
    _id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    totalInvest: number;
    lastLogin?: string;
    lastActive?: string;
}

export default function AdminUsersPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get(`/admin/users?search=${search}`);
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        const debounce = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(debounce);
    }, [search]);

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground">Admin access required.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                <AdminSidebar />

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold gradient-text tracking-tighter">User Management</h1>
                            <p className="text-muted-foreground">Search and manage platform students</p>
                        </div>

                        <div className="relative group w-full md:w-96">
                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, email or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-card/30 backdrop-blur-2xl border border-white/5 rounded-2xl focus:outline-none focus:border-primary/50 transition-all relative z-10"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                            <p className="text-muted-foreground font-medium">Fetching users...</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {users.length === 0 ? (
                                <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-white/10">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                    <p className="text-xl font-medium text-muted-foreground">No users found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-3xl bg-card/30 backdrop-blur-2xl border border-white/5 shadow-2xl">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">User</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">User ID</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Active</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Invest</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map((u) => {
                                                const lastActiveDate = u.lastActive ? new Date(u.lastActive) : null;
                                                const isActive = lastActiveDate && (new Date().getTime() - lastActiveDate.getTime()) < 300000; // 5 minutes

                                                return (
                                                    <tr key={u._id} className="group hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
                                                                    {u.profileImage ? (
                                                                        <Image src={u.profileImage} alt={u.name} width={40} height={40} className="h-full w-full object-cover" unoptimized />
                                                                    ) : (
                                                                        <Users className="h-5 w-5 text-primary" />
                                                                    )}
                                                                </div>
                                                                <span className="font-bold tracking-tight">{u.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                                <Mail className="h-3 w-3" />
                                                                <span>{u.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-2 text-sm font-mono text-muted-foreground">
                                                                <Fingerprint className="h-3 w-3" />
                                                                <span>{u.userId}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {isActive ? (
                                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Active</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Offline</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                                                <Clock className="h-3 w-3" />
                                                                {u.lastActive ? formatDistanceToNow(new Date(u.lastActive), { addSuffix: true }) : 'Never'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                                                                <DollarSign className="h-3 w-3" />
                                                                <span>{u.totalInvest.toLocaleString()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link href={`/admin/users/${u._id}`}>
                                                                <button className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ml-auto">
                                                                    <span>View Details</span>
                                                                    <ChevronRight className="h-3 w-3" />
                                                                </button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
