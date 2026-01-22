'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';

interface Job {
    _id: string;
    name: string;
    type: string;
    scheduledAt: string;
    status: string;
    data: Record<string, unknown>;
    imageUrl?: string;
}

export default function JobsPage() {
    const { t } = useTranslation();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newJob, setNewJob] = useState({
        name: '',
        type: 'notification',
        scheduledAt: '',
        data: {
            message: '',
            messageAr: '',
            imageUrl: ''
        }
    });

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs');
            setJobs(data);
        } catch {
            toast.error(t('admin.jobs.error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/jobs', newJob);
            toast.success(t('admin.jobs.success'));
            setShowModal(false);
            fetchJobs();
        } catch {
            toast.error(t('admin.jobs.error'));
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            toast.success(t('admin.jobs.delete_success'));
            fetchJobs();
        } catch {
            toast.error(t('admin.jobs.delete_error'));
        }
    };

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            setUploading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload/cloudinary`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.path) {
                    setNewJob(prev => ({
                        ...prev,
                        data: { ...prev.data, imageUrl: data.path }
                    }));
                    toast.success('Image uploaded successfully');
                }
                setUploading(false);
            } catch (error) {
                console.error(error);
                setUploading(false);
                toast.error('Image upload failed');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">{t('admin.jobs.title')}</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-white font-medium hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined">add</span>
                    {t('admin.jobs.schedule_new')}
                </button>
            </div>

            <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs font-medium uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">{t('admin.jobs.name')}</th>
                            <th className="px-6 py-4">{t('admin.jobs.type')}</th>
                            <th className="px-6 py-4">{t('admin.jobs.status')}</th>
                            <th className="px-6 py-4">{t('admin.jobs.scheduled_for')}</th>
                            <th className="px-6 py-4">{t('admin.jobs.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {jobs.map((job) => (
                            <tr key={job._id} className="text-gray-300 hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{job.name}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-md bg-white/5 text-xs">
                                        {job.type === 'notification' ? t('admin.jobs.notification') : t('admin.jobs.discount')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-xs ${job.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                            job.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {new Date(job.scheduledAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDeleteJob(job._id)} className="text-gray-400 hover:text-white">
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {jobs.length === 0 && !loading && (
                    <div className="p-10 text-center text-gray-500">{t('admin.jobs.no_jobs')}</div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-background-dark w-full max-w-md rounded-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">{t('admin.jobs.dialog_title')}</h2>
                        <form onSubmit={handleCreateJob} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.jobs.job_name')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    value={newJob.name}
                                    onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.jobs.type')}</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    value={newJob.type}
                                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                >
                                    <option value="notification">{t('admin.jobs.notification')}</option>
                                    <option value="discount">{t('admin.jobs.discount')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.jobs.date_time')}</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                    value={newJob.scheduledAt}
                                    onChange={(e) => setNewJob({ ...newJob, scheduledAt: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.jobs.message_en')}</label>
                                <textarea
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                                    value={newJob.data.message}
                                    onChange={(e) => setNewJob({ ...newJob, data: { ...newJob.data, message: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.jobs.message_ar')}</label>
                                <textarea
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-20"
                                    value={newJob.data.messageAr}
                                    onChange={(e) => setNewJob({ ...newJob, data: { ...newJob.data, messageAr: e.target.value } })}
                                />
                            </div>
                            
                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{t('admin.jobs.image')}</label>
                                <label className="relative cursor-pointer block mt-2">
                                    <input
                                        type="file"
                                        onChange={uploadFileHandler}
                                        className="hidden"
                                    />
                                    <div className="flex items-center justify-center gap-3 w-full h-32 rounded-lg border-2 border-dashed border-white/20 bg-background-dark hover:border-primary hover:bg-white/5 transition-all">
                                        <span className="material-symbols-outlined text-4xl text-primary">add</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-white font-semibold">{t('admin.product.choose_images')}</span>
                                            <span className="text-gray-400 text-sm">{t('admin.product.drag_drop')}</span>
                                        </div>
                                    </div>
                                </label>
                                {uploading && <p className="text-sm text-yellow-400 mt-2">{t('admin.jobs.uploading')}</p>}
                                {newJob.data.imageUrl && (
                                    <div className="mt-4 relative group w-fit">
                                        <Image src={newJob.data.imageUrl || ''} alt="Job Image" width={128} height={128} className="object-contain rounded-lg border border-white/10 bg-white" />
                                        <button
                                            type="button"
                                            onClick={() => setNewJob(prev => ({ ...prev, data: { ...prev.data, imageUrl: '' } }))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-white/10 rounded-lg text-white font-medium hover:bg-white/5"
                                >
                                    {t('admin.jobs.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary rounded-lg text-white font-medium hover:bg-primary/90"
                                >
                                    {t('admin.jobs.schedule')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
