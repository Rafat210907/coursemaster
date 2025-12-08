'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardSidebar() {
  const { user } = useSelector((state: any) => state.auth);
  const [openAdmin, setOpenAdmin] = useState(false);

  if (!user) return null;

  const menuItems = [
    { name: 'Overview', icon: '📊', href: '/dashboard' },
    ...(user.role === 'admin'
      ? [
          {
            name: 'Admin Panel',
            icon: '⚙️',
            submenu: [
              { name: 'Courses', icon: '📚', href: '/admin/courses' },
              { name: 'Analytics', icon: '📈', href: '/admin/analytics' },
              { name: 'Create Quiz', icon: '❓', href: '/admin/quiz' },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="bg-gradient-to-b from-slate-800/80 to-purple-900/80 backdrop-blur-xl border-r border-purple-500/20 h-screen p-6 w-64 fixed left-16 top-16 overflow-y-auto">
      <div className="space-y-4">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {item.submenu ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <button
                  onClick={() => setOpenAdmin(!openAdmin)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700/50 hover:bg-purple-500/30 transition text-gray-300 hover:text-white"
                >
                  <span>{item.icon}</span>
                  <span className="flex-1 text-left">{item.name}</span>
                  <span className="text-xs">{openAdmin ? '▼' : '▶'}</span>
                </button>
                {openAdmin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="ml-4 mt-2 space-y-2"
                  >
                    {item.submenu.map((subitem, sidx) => (
                      <Link
                        key={sidx}
                        href={subitem.href}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-500/20 transition text-gray-400 hover:text-white"
                      >
                        <span>{subitem.icon}</span>
                        <span>{subitem.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-500/30 transition text-gray-300 hover:text-white"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}