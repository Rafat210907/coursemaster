'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, Users, Plus, Menu, X, Megaphone } from 'lucide-react';
import { useState } from 'react';

export function AdminSidebar() {
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);

    const sidebarItems = [
        { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/admin' },
        { id: 'courses', label: 'Admin Courses', icon: BookOpen, href: '/admin/courses' },
        { id: 'tutors', label: 'Manage Tutors', icon: Users, href: '/admin/tutors' },
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
                w-64 bg-card border-r min-h-screen transition-transform duration-300 transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-6 text-primary">Admin Control</h2>
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                >
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
        </>
    );
}
