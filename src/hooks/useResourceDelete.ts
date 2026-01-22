import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface UseResourceDeleteOptions {
    fn: (id: string) => Promise<unknown>;
    resourceName: string;
    queryKey: string[];
    successMessage?: string;
    errorMessage?: string;
}

export function useResourceDelete({
    fn,
    resourceName,
    queryKey,
    successMessage,
    errorMessage,
}: UseResourceDeleteOptions) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: fn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: [`${resourceName.toLowerCase()}-stats`] }); // Common pattern
            toast.success(successMessage || `${resourceName} deleted successfully`);
        },
        onError: (error: Error) => {
            toast.error(errorMessage || error.message || `Failed to delete ${resourceName}`);
        },
    });

    const handleDelete = (id: string) => {
        if (confirm(`Are you sure you want to delete this ${resourceName.toLowerCase()}?`)) {
            deleteMutation.mutate(id);
        }
    };

    return {
        handleDelete,
        isLoading: deleteMutation.isPending,
    };
}
