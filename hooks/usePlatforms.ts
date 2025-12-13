'use client';

import { useState, useEffect, useCallback } from 'react';
import { platformService } from '@/services/platform.service';
import type { PlatformCredential, PlatformCredentialDTO } from '@/types/platform';
import { authService } from '@/services/auth.service';

export function usePlatforms() {
    const [platforms, setPlatforms] = useState<PlatformCredential[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchPlatforms = useCallback(async (pageNum: number = 0, pageSize: number = 9) => {
        try {
            setLoading(true);
            setError(null);

            const response = await platformService.getPlatformsPaginated(pageNum, pageSize);

            setPlatforms(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setPage(pageNum);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar las plataformas';
            setError(errorMessage);
            setPlatforms([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const findByName = async (name: string): Promise<PlatformCredential> => {
        try {
            setError(null);
            const platform = await platformService.getPlatformByName(name);
            return platform;
        } catch (err){
            const errorMessage = err instanceof Error ? err.message: 'Error al buscar la plataforma por nombre';
            setError(errorMessage);
            throw err;
        }
    }

    const createPlatform = async (platform: PlatformCredentialDTO) => {
        try {
            setError(null);
            const newPlatform = await platformService.createPlatform(platform);
            console.log('Plataforma creada:', newPlatform);

            // Recargar las plataformas después de crear
            await fetchPlatforms(page);

            return newPlatform;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear la plataforma';
            setError(errorMessage);
            throw err;
        }
    };

    const updatePlatform = async (id: string, platform: PlatformCredentialDTO) => {
        try {
            setError(null);
            const updatedPlatform = await platformService.updatePlatform(id, platform);
            console.log('Plataforma actualizada:', updatedPlatform);
            // Actualizar la lista local
            setPlatforms(prev =>
                prev.map(p => p.id === id ? updatedPlatform : p)
            );

            return updatedPlatform;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la plataforma';
            setError(errorMessage);
            throw err;
        }
    };

    const deletePlatform = async (id: string) => {
        try {
            setError(null);
            await platformService.deletePlatform(id);

            // Actualizar la lista local
            setPlatforms(prev => prev.filter(p => p.id !== id));
            setTotalElements(prev => prev - 1);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la plataforma';
            setError(errorMessage);
            throw err;
        }
    };

    useEffect(() => {
        const token = authService.getToken();
        if (token) {
            fetchPlatforms();
        } else {
            console.log('No hay token, no se pueden cargar plataformas');
        }
    }, [fetchPlatforms]);

    return {
        platforms,
        loading,
        error,
        page,
        totalPages,
        totalElements,
        fetchPlatforms,
        findByName,
        createPlatform,
        updatePlatform,
        deletePlatform,
        refetch: fetchPlatforms,
    };
}