'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from './store/slices/courseSlice';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CustomSelect } from '../components/ui/CustomSelect';
import { Course } from '../types';
import { RootState, AppDispatch } from './store/store';
import {
  Search,
  Filter,
  Users,
  BookMarked,
  Trophy,
  Star,
  Award,
  Rocket,
  Zap,
  Clock,
  ShieldCheck,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error, totalPages, currentPage } = useSelector((state: RootState) => state.courses);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, search, category }));
  }, [dispatch, search, category]);

  const handlePageChange = (page: number) => {
    dispatch(fetchCourses({ page, search, category }));
  };

  const stats = [
    { icon: <Users className="h-6 w-6" />, label: "Active Students", value: "50K+" },
    { icon: <BookMarked className="h-6 w-6" />, label: "Total Courses", value: "200+" },
    { icon: <Star className="h-6 w-6" />, label: "Avg. Rating", value: "4.9/5" },
    { icon: <Trophy className="h-6 w-6" />, label: "Certifications", value: "10K+" },
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Self-Paced Learning",
      description: "Learn at your own speed with lifetime access to all course materials and resources."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-green-400" />,
      title: "Expert Instructors",
      description: "Get taught by industry veterans with years of experience in their respective fields."
    },
    {
      icon: <Award className="h-8 w-8 text-purple-400" />,
      title: "Recognized Certificates",
      description: "Earn certificates that are recognized by top employers and industry leaders."
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      content: "CourseMaster transformed my career. The React Mastery course was exactly what I needed to land my dream job.",
      avatar: "AJ"
    },
    {
      name: "Sarah Chen",
      role: "UX Designer",
      content: "The quality of instructors is unparalleled. I've taken several design courses and this platform is by far the best.",
      avatar: "SC"
    },
    {
      name: "Michael Ross",
      role: "Data Scientist",
      content: "Comprehensive materials and practical projects. The Python for Data Science course helped me build a solid portfolio.",
      avatar: "MR"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-float" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
                <Rocket className="h-4 w-4" />
                <span>Next Generation Learning Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                Unlock Your Potential with <span className="gradient-text neon-glow">Mastery</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
                Experience world-class education from industry giants. Start your journey today and accelerate your career path with CourseMaster.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/courses">
                  <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold shadow-neon hover:shadow-neon-glow transition-all duration-300">
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg font-bold border-white/10 hover:bg-white/5">
                    Join for Free
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center font-bold text-xs uppercase">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center font-bold text-xs">
                    +50k
                  </div>
                </div>
                <span>Trusted by over <span className="text-foreground font-bold font-mono">50,000+</span> ambitious learners</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/hero-image.png"
                  alt="Education Abstract"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl border-white/20 animate-float">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <PlayCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Watch Promo Video</p>
                      <p className="text-sm text-muted-foreground">See how CourseMaster works</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative bg-dot-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 text-center group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Listing Section */}
      <section id="courses" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Popular <span className="gradient-text">Courses</span></h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Choose from over 200+ world-class courses taught by industry veterans.
                Everything from web development to creative arts.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 text-base"
                />
              </div>
              <div className="flex items-center gap-3 glass px-1.5 rounded-2xl border-white/10 w-full md:w-64">
                <div className="pl-3">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                </div>
                <CustomSelect
                  value={category}
                  onChange={(val) => setCategory(val)}
                  options={[
                    { value: '', label: 'All Categories' },
                    { value: 'programming', label: 'Programming' },
                    { value: 'design', label: 'Design' },
                    { value: 'business', label: 'Business' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'data-science', label: 'Data Science' },
                  ]}
                  className="flex-1"
                  placeholder="Categories"
                />
              </div>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="glass-card h-full min-h-[420px] flex flex-col">
                  <CardHeader className="pt-8">
                    <Skeleton height={32} baseColor="#110d18" highlightColor="#221a31" borderRadius={12} />
                    <Skeleton height={20} width="60%" baseColor="#110d18" highlightColor="#221a31" borderRadius={8} className="mt-2" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <Skeleton count={3} baseColor="#110d18" highlightColor="#221a31" borderRadius={8} className="mb-2" />
                  </CardContent>
                  <CardFooter className="mt-auto p-6 pt-0 border-t border-white/5 space-y-4 flex flex-col items-stretch">
                    <div className="flex justify-between items-center w-full mt-4">
                      <Skeleton height={40} width={80} baseColor="#110d18" highlightColor="#221a31" borderRadius={12} />
                      <Skeleton height={48} width={140} baseColor="#110d18" highlightColor="#221a31" borderRadius={16} />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-20 glass rounded-[2rem] border-red-500/20 max-w-xl mx-auto">
              <p className="text-destructive text-xl font-semibold mb-4">Connection Issue</p>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl px-8 font-bold">Try Again</Button>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {courses.map((course: Course, index: number) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass-card h-full flex flex-col group hover:scale-[1.02] transition-all duration-500 rounded-[2rem] overflow-hidden border-white/5">
                    <div className="absolute top-0 right-0 p-4 z-20">
                      <span className="glass px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border-primary/20">
                        {course.category}
                      </span>
                    </div>

                    <CardHeader className="relative z-10 pt-8">
                      <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-muted-foreground/80 mt-2 font-medium">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10 flex-grow">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] text-white font-black shadow-lg">
                            {(() => {
                              const inst = course.instructors?.[0];
                              return (typeof inst === 'object' && inst !== null ? inst.name : 'Unknown').charAt(0);
                            })()}
                          </div>
                          <span className="line-clamp-1">
                            {(course.instructors || []).map(inst => typeof inst === 'object' && inst !== null ? inst.name : 'Unknown').join(', ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground/50">
                          <span className="flex items-center gap-1.5">
                            <Zap className="h-3 w-3 text-primary" />
                            {course.lessons?.length || 0} Lessons
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-blue-400" />
                            {course.duration} Hours
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {course.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-white/5 border border-white/10 text-muted-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center relative z-10 p-6 pt-4 border-t border-white/5 mt-auto bg-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Access Fee</span>
                        <div className="flex items-baseline gap-0.5 leading-none">
                          <span className="text-sm font-black text-primary">$</span>
                          <span className="text-3xl font-black text-white tracking-tighter">{course.price}</span>
                        </div>
                      </div>
                      <Link href={`/course/${course._id}`}>
                        <Button className="rounded-xl px-6 h-12 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-neon transition-all duration-300 font-black text-xs uppercase tracking-widest border-none">
                          Enroll Now
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div className="text-center py-20 glass rounded-[2.5rem] border-white/10">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-2xl font-bold mb-2">No Courses Found</h3>
              <p className="text-muted-foreground mb-8">Try adjusting your search or filters to find what you're looking for.</p>
              <Button onClick={() => { setSearch(''); setCategory(''); }} variant="outline" className="rounded-xl font-bold">Clear Filters</Button>
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="mt-16 flex justify-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  className={`w-12 h-12 rounded-xl font-bold ${page === currentPage ? 'shadow-neon' : 'border-white/10'}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Illustration Section */}
      <section className="py-24 bg-card/30 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Why Choose <span className="gradient-text">CourseMaster?</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              We provide the highest quality learning experience with tools designed to help you succeed in the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center space-y-6 p-8 glass-card"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-primary/20">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Learner <span className="gradient-text">Success Stories</span></h2>
            <p className="text-lg text-muted-foreground font-medium">Join thousands of students who have advanced their careers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-lg font-medium italic leading-relaxed">"{t.content}"</p>
                </div>

                <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-black text-white shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-base">{t.name}</h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="glass-card bg-gradient-to-br from-primary/20 to-accent/10 p-12 md:p-20 text-center border-primary/20">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to Master <br /><span className="gradient-text">Your Future?</span></h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Start learning today with our curated selection of professional courses. No commitments, cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-black shadow-neon hover:shadow-neon-glow transition-all w-full sm:w-auto uppercase tracking-widest">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-black bg-white/5 border-white/10 hover:bg-white/10 w-full sm:w-auto uppercase tracking-widest">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background blobs for CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent rounded-full blur-[120px]" />
        </div>
      </section>
    </div>
  );
}
