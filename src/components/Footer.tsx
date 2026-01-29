'use client';

import Link from 'next/link';
import { BookOpen, Github, Twitter, Linkedin, Facebook, Mail, Phone, MapPin, User } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-card/30 border-t border-white/10 pt-20 pb-10 overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-3 group w-fit">
                            <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
                                <BookOpen className="h-6 w-6 text-primary neon-glow" />
                            </div>
                            <span className="text-2xl font-black gradient-text">CourseMaster</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            Empowering learners worldwide with industry-standard courses and masterclasses from top-tier instructors.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 glass rounded-lg hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 glass rounded-lg hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 glass rounded-lg hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">All Courses</Link></li>
                            <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
                            <li><Link href="/instructors" className="text-muted-foreground hover:text-primary transition-colors">Become a Tutor</Link></li>
                            <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing Plans</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold mb-6">Contact Us</h4>
                        <div className="flex items-start gap-3 text-muted-foreground">
                            <Mail className="h-5 w-5 text-primary mt-1" />
                            <span>support@coursemaster.com</span>
                        </div>
                        <div className="flex items-start gap-3 text-muted-foreground">
                            <Phone className="h-5 w-5 text-primary mt-1" />
                            <span>+1 (555) 000-0000</span>
                        </div>
                        <div className="flex items-start gap-3 text-muted-foreground">
                            <MapPin className="h-5 w-5 text-primary mt-1" />
                            <span>123 Learning Way, Digital City, DC 10101</span>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} CourseMaster. All rights reserved.
                    </p>
                    <a
                        href="https://guns.lol/zerox6968"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 group"
                    >
                        <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium text-muted-foreground/60 transition-colors">
                            Developed by <span className="text-foreground font-bold font-mono">TAHSAN AHMED RAFAT</span>
                        </span>
                    </a>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
                        <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
