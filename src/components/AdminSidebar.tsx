'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, Users, Plus } from 'lucide-react';

export function AdminSidebar() {
    const pathname = usePathname();

    const sidebarItems = [
        { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin' },
        { id: 'courses', label: 'Admin Courses', icon: BookOpen, href: '/admin/courses' },
        { id: 'tutors', label: 'Manage Tutors', icon: Users, href: '/admin/tutors' },
        { id: 'quiz', label: 'Create Quiz', icon: Plus, href: '/admin/quiz' },
    ];

    return (
        <div className="w-64 bg-card border-r min-h-screen">
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-6 text-primary">Admin Control</h2>
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.id} href={item.href}>
                                <div
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                            : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                                    <span className="text-sm font-semibold">{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
