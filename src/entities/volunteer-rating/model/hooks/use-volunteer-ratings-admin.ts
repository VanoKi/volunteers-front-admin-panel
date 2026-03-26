import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { volunteerRatingApi } from '../../api';
import type { VolunteerRatingsAdminResponse } from '../types';

interface UseVolunteerRatingsAdminParams {
    page?: number;
    limit?: number;
    search?: string;
}

export function useVolunteerRatingsAdmin(params: UseVolunteerRatingsAdminParams) {
    return useQuery<VolunteerRatingsAdminResponse>({
        queryKey: ['volunteer-ratings-admin', params],
        queryFn: async (): Promise<VolunteerRatingsAdminResponse> => {
            const response = await volunteerRatingApi.getRatingsAdmin(params);
            return response;
        },
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });
}
