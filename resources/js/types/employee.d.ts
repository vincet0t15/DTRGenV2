import { EmploymentTypeProps } from './employmentType';
import { NightShiftProps } from './nightShift';
import { OfficeProps } from './office';

export interface EmployeeProps {
    id: number;
    fingerprint_id: number;
    name: string;
    office_id: number;
    office: OfficeProps;
    is_active: boolean;
    is_permanent: boolean;
    employment_type_id?: number;
    employment_type: EmploymentTypeProps;
    night_shift?: NightShiftProps;
    nightShift?: boolean;
}

export type EmployeeTypes = {
    name?: string;
    fingerprint_id?: number;
    office_id?: number;
    employment_type_id?: number;
    flexi_time_in: Time;
    flexi_time_out: Time;
    nightShift?: boolean;
};
