import Pagination from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EmployeeProps } from '@/types/employee';
import { EmploymentTypeProps } from '@/types/employmentType';
import { FilterProps } from '@/types/filter';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconCircle } from '@tabler/icons-react';
import { FilterIcon } from 'lucide-react';
import { ChangeEventHandler, KeyboardEventHandler } from 'react';
import SelectEmployementType from './selectEmployementType';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daily Time Record',
        href: '/dtr',
    },
];

interface Props {
    employees: PaginatedDataResponse<EmployeeProps>;
    employmentTypes: EmploymentTypeProps[];
    filters: FilterProps;
}
export default function DTR({ employmentTypes, employees, filters }: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
        employment_type_id: 1, // match key with usage
    });

    const onChangeSelected = (id: number | 0) => {
        setData((prev) => ({ ...prev, employment_type_id: id }));
    };
    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            router.get(
                route('dtr.index'),
                {
                    data,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DTR" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="cursor-pointer">
                            <FilterIcon />
                            <span className="rounded-sm lg:inline">Filter Data</span>
                        </Button>

                        <SelectEmployementType value={data.employment_type_id} onChange={onChangeSelected} employment_types={employmentTypes} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>
                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Fingerprint ID</TableHead>
                                <TableHead>Office</TableHead>
                                <TableHead className="">Status</TableHead>
                                <TableHead className="">Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.data.length > 0 ? (
                                employees.data.map((employee, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell className="text-sm uppercase">{employee.name}</TableCell>
                                        <TableCell className="text-sm">{employee.fingerprint_id}</TableCell>
                                        <TableCell className="text-sm uppercase">{employee.office.office_name}</TableCell>
                                        <TableCell>
                                            {employee.is_active ? (
                                                <Badge variant="outline">
                                                    <IconCircle className="fill-green-500 dark:fill-green-400" />
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    <IconCircle className="dark:fill-orange-700" />
                                                    Inactive
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-sm">{employee.employment_type.employment_type}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-3 text-center text-gray-500">
                                        No incoming documents available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={employees} />
                </div>
            </div>
        </AppLayout>
    );
}
