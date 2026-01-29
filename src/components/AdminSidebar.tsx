'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, Users, Plus, Menu, X, Megaphone, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/admin' },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp, href: '/admin/analytics' },
        { id: 'courses', label: 'Admin Courses', icon: BookOpen, href: '/admin/courses' },
        { id: 'tutors', label: 'Manage Tutors', icon: Users, href: '/admin/tutors' },
        { id: 'users', label: 'Manage Users', icon: Users, href: '/admin/users' },
        { id: 'quiz', label: 'Create Quiz', icon: Plus, href: '/admin/quiz' },
        { id: 'notices', label: 'Notice Board', icon: Megaphone, href: '/admin/notices' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary text-primary-foreground rounded-full shadow-2xl transition-transform active:scale-90"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-40
                w-64 bg-card/30 backdrop-blur-2xl border-r border-white/10 min-h-screen transition-all duration-500 transform overflow-y-auto
                ${isOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4">
                    <h2 className="text-xl font-black mb-6 gradient-text tracking-tighter">Admin Console</h2>
                    <nav className="space-y-1.5">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block group"
                                >
                                    <div
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 neon-border'
                                            : 'hover:bg-white/5 text-muted-foreground hover:text-foreground hover:translate-x-1'
                                            }`}
                                    >
                                        <item.icon className={`h-5 w-5 ${isActive ? 'scale-110 shadow-glow' : 'group-hover:scale-110'} transition-transform duration-300`} />
                                        <span className="text-xs font-bold tracking-wide uppercase tracking-widest">{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}
