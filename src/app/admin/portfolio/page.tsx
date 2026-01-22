'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import PortfolioTable from '@/components/admin/PortfolioTable';
import PortfolioForm from '@/components/admin/PortfolioForm';
import { Portfolio } from '@/types';

export default function AdminPortfolioPage() {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Portfolio | null>(null);

    const handleEdit = (project: Portfolio) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const handleCreate = () => {
        setSelectedProject(null);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedProject(null);
    };

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            <div className="bg-background-dark border-b border-white/5 py-5 px-8 sticky top-0 z-10">
                <AdminPageHeader
                    title={t('admin.portfolio.title')}
                    action={
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-white font-medium hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                            {t('admin.portfolio.add')}
                        </button>
                    }
                />
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <PortfolioTable onEdit={handleEdit} />
            </div>

            <PortfolioForm
                isOpen={showModal}
                onClose={handleClose}
                initialData={selectedProject}
            />
        </div>
    );
}
