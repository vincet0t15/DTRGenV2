import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface FilterProps {
    search: string;
    office_id: number;
    selectedMonth: string;
    selectedYear: string;
    type: string;
    filterTypes: number[];
    employment_type_id: number;
}

interface MyPageProps extends InertiaPageProps {
    filters: FilterProps;
}
