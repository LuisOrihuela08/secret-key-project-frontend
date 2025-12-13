import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api-config";
import { authService } from "./auth.service";
import type { PlatformCredential, PageResponse, PlatformCredentialDTO } from "@/types/platform";

class PlatformService {
    private getHeaders(): HeadersInit {
        const token = authService.getToken();

        if (!token) {
            throw new Error("No autenticado");
        }

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    private getFileHeaders(): HeadersInit {
        const token = authService.getToken();
        if (!token) {
            throw new Error('No autenticado');

        }
        return {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };
    }

    async getPlatformsPaginated(page: number = 0, size: number = 9): Promise<PageResponse<PlatformCredential>> {
        try {
            const token = authService.getToken();
            console.log('Token:', token?.substring(0, 20) + '...');

            const url = `${API_BASE_URL}${API_ENDPOINTS.platforms.list}?page=${page}&size=${size}`;

            const headers = this.getHeaders();

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            if (!response.ok) {
               
                if (response.status === 401) {
                    authService.logout();
                    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
                }

                if (response.status === 204 || response.status === 404) {
                   
                    return {
                        content: [],
                        totalPages: 0,
                        totalElements: 0,
                        size,
                        number: page,
                        first: true,
                        last: true,
                        empty: true,
                        numberOfElements: 0,
                        pageable: {
                            pageNumber: page,
                            pageSize: size,
                            sort: { empty: true, sorted: false, unsorted: true },
                            offset: 0,
                            paged: true,
                            unpaged: false,
                        },
                        sort: { empty: true, sorted: false, unsorted: true },
                    };
                }

                const error = await response.json().catch(() => ({
                    message: 'Error al cargar las plataformas'
                }));
                throw new Error(error.message || 'Error al cargar las plataformas');
            }

            const data: PageResponse<PlatformCredential> = await response.json();
            return data;
        } catch (error) {
            console.error('Error en getPlatformsPaginated:', error);
            throw error;
        }
    }

    async getPlatformByName(name: string): Promise<PlatformCredential> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.platforms.findByname(name)}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
                }
                const error = await response.json().catch(() => ({
                    message: 'Error al obtener la plataforma por nombre'
                }));
                throw new Error(error.message || 'Error al obtener la plataforma por nombre');
            }

            const data: PlatformCredential = await response.json();
            return data;
        } catch (error) {
            console.error('Error en getPlatformByName: ', error);
            throw error;
        }
    }


    async createPlatform(platform: PlatformCredentialDTO): Promise<PlatformCredential> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.platforms.create}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(platform),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
                }

                const error = await response.json().catch(() => ({
                    message: 'Error al crear la plataforma'
                }));
                throw new Error(error.message || 'Error al crear la plataforma');
            }

            const data: PlatformCredential = await response.json();
            return data;
        } catch (error) {
            console.error('Error en createPlatform:', error);
            throw error;
        }
    }

    async updatePlatform(id: string, platform: PlatformCredentialDTO): Promise<PlatformCredential> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.platforms.update(id)}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(platform),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
                }

                const error = await response.json().catch(() => ({
                    message: 'Error al actualizar la plataforma'
                }));
                throw new Error(error.message || 'Error al actualizar la plataforma');
            }

            const data: PlatformCredential = await response.json();
            return data;
        } catch (error) {
            console.error('Error en updatePlatform:', error);
            throw error;
        }
    }

    async deletePlatform(id: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.platforms.delete(id)}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
                }

                const error = await response.json().catch(() => ({
                    message: 'Error al eliminar la plataforma'
                }));
                throw new Error(error.message || 'Error al eliminar la plataforma');
            }
        } catch (error) {
            console.error('Error en deletePlatform:', error);
            throw error;
        }
    }

    async exportPlarformsToExcel(): Promise<Blob> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.platforms.exportExcel}`, {
                method: 'GET',
                headers: this.getFileHeaders(),
            });
            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
                }
                const error = await response.json().catch(() => ({
                    message: 'Error al exportar Excel de las plataformas'
                }));
                throw new Error(error.message || 'Error al exportar excel las plataformas');
            }
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Error en exportar excel de las plataformas: ', error);
            throw error;
        }
    }

    async exportPlatformsToPdf(): Promise<Blob> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.platforms.exportPdf}`, {
                method: 'GET',
                headers: this.getFileHeaders(),
            });
            if (!response.ok) {
                if (response.status === 401) {
                    authService.logout();
                    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
                }
                const error = await response.json().catch(() => ({
                    message: 'Error al exportar Pdf de las plataformas'
                }));
                throw new Error(error.message || 'Error al exportar PDF las plataformas');
            }
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Error en exportar pdf de las plataformas: ', error);
            throw error;
        }
    }

}

export const platformService = new PlatformService();