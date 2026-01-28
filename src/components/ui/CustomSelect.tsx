'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function CustomSelect({ options, value, onChange, placeholder = 'Select an option', className = '' }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative min-w-[240px] ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-12 w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold transition-all hover:bg-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-xl group"
            >
                <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 8, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute z-[100] mt-2 w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0514]/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl"
                    >
                        <div className="max-h-72 overflow-y-auto select-scrollbar space-y-1.5 pr-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-[1.8rem] px-6 py-4 text-sm font-bold transition-all duration-300 ${value === option.value
                                        ? 'bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-[0.98]'
                                        : 'text-muted-foreground/80 hover:bg-white/5 hover:text-white hover:translate-x-1'
                                        }`}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && <Check className="h-4 w-4 stroke-[3]" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
