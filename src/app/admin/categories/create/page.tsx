import Link from 'next/link';
import CategoryForm from '@/components/admin/CategoryForm';

export default function CreateCategoryPage() {
    return (
        <div className="flex flex-col w-full mx-auto">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 py-4 text-sm">
                <Link href="/admin" className="text-gray-400 hover:text-primary transition-colors font-medium">Dashboard</Link>
                <span className="text-gray-400 font-medium">/</span>
                <Link href="/admin/categories" className="text-gray-400 hover:text-primary transition-colors font-medium">Categories</Link>
                <span className="text-gray-400 font-medium">/</span>
                <span className="text-white font-medium">Create Category</span>
            </div>

            {/* Page Heading & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Add New Category</h1>
                    <p className="text-gray-400 text-base font-normal">Fill in the details to create a new category listing.</p>
                </div>
            </div>

            <CategoryForm />

            <div className="h-10"></div>
        </div>
    );
}
