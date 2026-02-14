'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import PortfolioTable from '@/components/admin/PortfolioTable';
import PortfolioForm from '@/components/admin/PortfolioForm';
import { Portfolio } from '@/types';
import { Button } from '@/components/ui/button';

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
            <div className="bg-surface-dark border-b border-border py-5 px-8 sticky top-0 z-10">
                <AdminPageHeader
                    title={t('admin.portfolio.title')}
                    action={
                        <Button
                            onClick={handleCreate}
                            className="rounded-full shadow-[0_0_20px_rgba(54,226,123,0.3)] hover:shadow-[0_0_30px_rgba(54,226,123,0.5)]"
                        >
                            <span className="material-symbols-outlined">add</span>
                            {t('admin.portfolio.add')}
                        </Button>
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
