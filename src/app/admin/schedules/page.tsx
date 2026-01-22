'use client';

import React from 'react';
import SchedulesTable from '@/components/admin/schedules/SchedulesTable';
import ScheduleForm from '@/components/admin/schedules/ScheduleForm';
import { useTranslation } from '@/hooks/useTranslation';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';

export default function SchedulesPage() {
    const { t } = useTranslation();

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            <div className="bg-background-dark border-b border-white/5 py-5 px-8 sticky top-0 z-10">
                <AdminPageHeader
                    title={t('admin.schedules.title')}
                    subtitle={t('admin.schedules.subtitle')}
                    action={<ScheduleForm />}
                />
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
                <SchedulesTable />
            </div>
        </div>
    );
}
