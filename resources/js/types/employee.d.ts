import { OfficeProps } from './office';

export interface EmployeeProps {
    id: number;
    fingerprint_id: number;
    name: string;
    office_id: number;
    office: OfficeProps;
    is_active: boolean;
    is_permanent: boolean;
}
