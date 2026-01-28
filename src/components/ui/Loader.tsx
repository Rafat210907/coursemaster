'use client';

import { motion } from 'framer-motion';

export const Loader = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
    const dimensions = {
        small: 'w-6 h-6 border-2',
        medium: 'w-12 h-12 border-4',
        large: 'w-20 h-20 border-[6px]',
    };

    return (
        <div className="flex items-center justify-center">
            <div className="relative">
                {/* Outer Glow */}
                <div className={`absolute inset-0 rounded-full blur-md opacity-50 bg-primary ${dimensions[size].split(' ')[0]} ${dimensions[size].split(' ')[1]}`} />

                {/* The Loader Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={`${dimensions[size]} rounded-full border-white/10 border-t-primary border-r-primary/50`}
                    style={{
                        boxShadow: '0 0 15px hsla(270, 90%, 60%, 0.3)',
                    }}
                />

                {/* Center Point (Optional, for that premium feel) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`rounded-full bg-primary/20 blur-sm ${size === 'large' ? 'w-4 h-4' : 'w-2 h-2'}`} />
                </div>
            </div>
        </div>
    );
};

export const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl">
            <Loader size="large" />
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-xl font-bold gradient-text tracking-widest uppercase"
            >
                Loading CourseMaster
            </motion.p>
        </div>
    );
};
