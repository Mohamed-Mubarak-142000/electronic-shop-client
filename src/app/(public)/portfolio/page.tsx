'use client';

import { useState, useEffect } from 'react';
import { portfolioService } from '@/services/portfolioService';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import Image from 'next/image';
import { Portfolio, PortfolioOwnerResponse } from '@/types';
import {
    Briefcase,
    MapPin,
    Award,
    ExternalLink,
    Plus,
    Edit3,
    Share2,
    ChevronRight,
    Shield,
    Lightbulb,
    ChevronLeft,
    Zap
} from 'lucide-react';

const ProjectCard = ({ project, index, language }: { project: Portfolio; index: number; language: string }) => {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (project.images && project.images.length > 0) {
            setCurrentImage((prev) => (prev + 1) % project.images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (project.images && project.images.length > 0) {
            setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length);
        }
    };

    const displayImage = (project.images && project.images.length > 0) ? project.images[currentImage] : 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800';

    return (
        <motion.div
            // Performance: Use only transform and opacity for smooth animations without layout shifts
            initial={{ opacity: 0, transform: "translateY(20px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group bg-[#112117] rounded-3xl overflow-hidden border border-[#1a3324] hover:border-primary/30 transition-all shadow-lg"
        >
            <div className="aspect-[4/3] bg-surface-highlight overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImage}
                        src={displayImage}
                        alt={project.title}
                        // Performance: Use opacity-only animation for image transitions
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </AnimatePresence>

                <div className="absolute top-4 left-4 bg-primary/90 text-[#0a140e] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest z-10">
                    {project.category || (language === 'ar' ? 'تجاري' : 'Commercial')}
                </div>

                {project.images && project.images.length > 1 && (
                    <>
                        <button
                            aria-label="Previous image"
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={20} aria-hidden="true" />
                        </button>
                        <button
                            aria-label="Next image"
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight size={20} aria-hidden="true" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {project.images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all ${i === currentImage ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <h4 className="text-xl font-bold line-clamp-1">{language === 'ar' ? project.titleAr : project.title}</h4>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{language === 'ar' ? project.descriptionAr : project.description}</p>
                </div>
                <Link href={`/portfolio/${project._id}`} className="w-full py-3 rounded-xl bg-surface-highlight border border-white/5 text-white text-sm font-bold group-hover:bg-primary group-hover:text-[#0a140e] transition-all flex items-center justify-center gap-2">
                    {language === 'ar' ? 'عرض دراسة الحالة' : 'View Case Study'}
                    <ChevronRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
};

export default function PortfolioDashboard() {
    const [data, setData] = useState<PortfolioOwnerResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const { language } = useTranslation();
    const { user } = useAuthStore();

    const isAdmin = user?.role === 'admin' && user?._id === data?.owner?._id;

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const res = await portfolioService.getOwnerPortfolio();
                setData(res);
            } catch (error) {
                console.error('Failed to fetch portfolio:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!data) return <div className="p-20 text-center text-white">No data found</div>;

    const { owner, portfolios } = data;

    return (
        <div className="min-h-screen bg-[#0a140e] text-white font-display pb-20">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">{language === 'ar' ? 'ملفي المهني' : 'My Portfolio'}</h1>
                    <p className="text-[#95c6a9] mt-2">
                        {language === 'ar' ? 'عرض للمشاريع والشهادات المهنية الخاصة بك.' : 'Showcase of your professional projects and certifications.'}
                    </p>
                </div>
                <div className="flex gap-4">
                    {user?.role !== 'user' && (
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface-highlight text-white hover:bg-[#1a3324] transition-all font-bold text-sm border border-white/5">
                            <ExternalLink size={18} />
                            {language === 'ar' ? 'عرض عام' : 'Public View'}
                        </button>
                    )}
                    {isAdmin && (
                        <Link href="/admin/portfolio">
                            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-[#0a140e] hover:brightness-110 transition-all font-black text-sm shadow-lg shadow-primary/20">
                                <Plus size={18} />
                                {language === 'ar' ? 'إضافة مشروع' : 'Add Project'}
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Profile Card */}
                    <div className="bg-[#112117] rounded-[2.5rem] p-8 border border-[#1a3324] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            <div className="size-32 rounded-3xl bg-surface-highlight overflow-hidden border-2 border-primary/20 shrink-0">
                                <Image
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop"
                                    alt={owner.name}
                                    width={128}
                                    height={128}
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <h2 className="text-3xl font-black">{owner.name}</h2>
                                        {owner.isHiring && (
                                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
                                                {language === 'ar' ? 'متاح للتوظيف' : 'Available for Hire'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xl text-[#95c6a9] font-medium">
                                        {language === 'ar' ? owner.jobTitleAr : owner.jobTitle || 'Master Electrician & Store Owner'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300">
                                        <MapPin size={14} className="text-primary" />
                                        {owner.address?.city}, {owner.address?.state}
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300">
                                        <Award size={14} className="text-primary" />
                                        {owner.experience || 15}+ Years Exp.
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300">
                                        <Shield size={14} className="text-primary" />
                                        {language === 'ar' ? 'مقاول مرخص' : 'Licensed Contractor'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 shrink-0">
                                {isAdmin && (
                                    <Link href="/profile" className="w-full">
                                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#0a140e] font-bold text-sm hover:bg-gray-200 transition-colors">
                                            <Edit3 size={16} />
                                            {language === 'ar' ? 'تعديل الملف' : 'Edit Profile'}
                                        </button>
                                    </Link>
                                )}
                                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-surface-highlight border border-white/5 text-white font-bold text-sm hover:bg-[#1a3324] transition-colors">
                                    <Share2 size={16} />
                                    {language === 'ar' ? 'مشاركة' : 'Share'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* About Me Section */}
                    <div className="bg-[#112117] rounded-[2.5rem] p-8 border border-[#1a3324] shadow-xl">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                            <span className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Lightbulb size={18} className="text-primary" />
                            </span>
                            {language === 'ar' ? 'عني' : 'About Me'}
                        </h3>
                        <p className="text-lg text-gray-300 leading-relaxed opacity-90">
                            {language === 'ar' ? (owner.bioAr || 'خبير كهربائي يتمتع بخبرة تزيد عن 15 عامًا في المشاريع السكنية والتجارية. متخصص في حلول الأتمتة الذكية والأنظمة عالية الجهد.') : (owner.bio || 'Professional electrician with over 15 years of experience in residential and commercial projects. Specialized in smart automation solutions and high voltage systems.')}
                        </p>
                    </div>

                    {/* Featured Projects Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black">{language === 'ar' ? 'المشاريع المميزة' : 'Featured Projects'}</h3>
                            <button className="flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                                {language === 'ar' ? 'عرض جميع المشاريع' : 'View All Projects'}
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {portfolios.map((project, idx) => (
                                <ProjectCard key={project._id} project={project} index={idx} language={language} />
                            ))}
                            {portfolios.length === 0 && (
                                <div className="col-span-full py-20 bg-surface-dark/30 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-gray-500">
                                    <Briefcase size={48} className="mb-4 opacity-20" />
                                    <p>{language === 'ar' ? 'لا توجد مشاريع مضافة بعد' : 'No projects added yet'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Core Competencies */}
                    <div className="bg-[#112117] rounded-[2.5rem] p-8 border border-[#1a3324] shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-black">{language === 'ar' ? 'الكفاءات الأساسية' : 'Core Competencies'}</h3>
                            <Zap className="text-primary animate-pulse" size={24} />
                        </div>
                        <div className="space-y-6">
                            {(owner.skills || [
                                { name: 'High Voltage Systems', nameAr: 'أنظمة الجهد العالي', level: 'Expert', icon: 'zap' },
                                { name: 'Smart Automation', nameAr: 'الأتمتة الذكية', level: 'Advanced', icon: 'settings' },
                                { name: 'Fiber Optics', nameAr: 'الألياف البصرية', level: 'Certified', icon: 'activity' },
                            ]).map((skill, idx) => {
                                // Calculate level percentage
                                const levelMap: Record<string, number> = {
                                    'Expert': 100,
                                    'Advanced': 85,
                                    'Certified': 75,
                                    'Intermediate': 60,
                                    'Beginner': 40
                                };
                                const percentage = levelMap[skill.level] || 50;

                                return (
                                    <div key={idx} className="group flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#0a140e] transition-all duration-300">
                                                    <Zap size={18} />
                                                </div>
                                                <p className="font-bold text-base tracking-wide text-gray-100">{language === 'ar' ? skill.nameAr : skill.name}</p>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-1 rounded-md">
                                                {skill.level}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: idx * 0.1 }}
                                                className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full relative"
                                            >
                                                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]"></div>
                                            </motion.div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats or Achievements */}
                    <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                                <p className="text-3xl font-black text-primary">120+</p>
                                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{language === 'ar' ? 'مشروع مكتمل' : 'Projects'}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-primary">50+</p>
                                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{language === 'ar' ? 'عميل سعيد' : 'Happy Clients'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-6 mt-20">
                <div className="bg-primary rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-[#0a140e] leading-tight">
                            {language === 'ar' ? 'جاهز لكهربة مشروعك القادم؟' : 'Ready to electrify your next project?'}
                        </h2>
                        <p className="text-[#0a140e]/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                            {language === 'ar' ? 'دعنا نتعاون لتحويل رؤيتك إلى حقيقة من خلال حلول كهربائية آمنة وذكية.' : 'Let’s collaborate to turn your vision into reality with safe and smart electrical solutions.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button 
                                onClick={() => window.dispatchEvent(new Event('open-chat'))}
                                className="px-10 py-5 rounded-full bg-[#0a140e] text-white text-lg font-black hover:scale-105 transition-transform shadow-2xl"
                            >
                                {language === 'ar' ? 'تواصل معنا' : 'Get In Touch'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
