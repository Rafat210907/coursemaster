'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BookOpen, ChevronRight, HelpCircle, Megaphone, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store/store';

interface DashboardSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function DashboardSidebar({ isOpen, setIsOpen }: DashboardSidebarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get('filter') || 'all';
    const { unreadCount } = useSelector((state: RootState) => state.notifications);

    const navItems = [
        { href: '/dashboard', label: 'My Courses', icon: BookOpen },
        {
            href: '/dashboard/quizzes',
            label: 'Quizzes',
            icon: HelpCircle,
            subItems: [
                { id: 'all', label: 'All Quizzes', filter: 'all' },
                { id: 'completed', label: 'Completed', filter: 'completed' },
                { id: 'not-started', label: 'Not Started', filter: 'not-started' },
                { id: 'ranking', label: 'Student Ranking', filter: 'ranking' },
            ]
        },
        { href: '/dashboard/notices', label: 'Notice Board', icon: Megaphone, count: unreadCount },
    ];

    return (
        <>
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-105 transition-transform"
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Sidebar Backdrop */}
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
                    <h2 className="text-xl font-black mb-6 gradient-text tracking-tighter">CourseMaster</h2>
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <div key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 neon-border'
                                            : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <item.icon className={`h-5 w-5 ${isActive ? 'scale-110 shadow-glow' : 'group-hover:scale-110'} transition-transform`} />
                                        <span className="font-bold tracking-wide text-sm">{item.label}</span>
                                        {item.count && item.count > 0 ? (
                                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
                                                {item.count}
                                            </span>
                                        ) : null}
                                    </Link>

                                    {item.subItems && isActive && (
                                        <div className="mt-1 ml-5 relative">
                                            {/* Vertical Line indicator */}
                                            <div className="absolute left-0 top-0 bottom-4 w-px bg-white/10" />

                                            <div className="space-y-1 py-1">
                                                {item.subItems.map((sub) => {
                                                    const subActive = currentFilter === sub.id;

                                                    return (
                                                        <button
                                                            key={sub.id}
                                                            onClick={() => {
                                                                const params = new URLSearchParams(searchParams);
                                                                params.set('filter', sub.filter);
                                                                window.history.pushState({}, '', `?${params.toString()}`);
                                                                window.dispatchEvent(new CustomEvent('quizFilterChange', { detail: sub.filter }));
                                                                setIsOpen(false);
                                                            }}
                                                            className={`w-full text-left pl-6 pr-3 py-2 text-[11px] font-bold transition-all flex items-center justify-between gap-2 relative group/sub rounded-lg ${subActive
                                                                ? 'text-primary bg-primary/5'
                                                                : 'text-muted-foreground/60 hover:text-foreground hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {/* Branch Line indicator */}
                                                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] transition-colors ${subActive ? 'bg-primary' : 'bg-white/10 group-hover/sub:bg-primary/30'
                                                                    }`} />

                                                                <span className="relative z-10">{sub.label}</span>
                                                            </div>
                                                            {subActive && <ChevronRight className="h-3 w-3 text-primary animate-in fade-in slide-in-from-left-1 duration-300" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </>
    );
}
