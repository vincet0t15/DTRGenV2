import Pagination from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EmployeeProps } from '@/types/employee';
import { EmploymentTypeProps } from '@/types/employmentType';
import { FilterProps } from '@/types/filter';
import { OfficeProps } from '@/types/office';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { FilterIcon, HardDriveDownload, Printer } from 'lucide-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { FilterData } from './filterData';
import ImportLogs from './importLogs';
import SelectEmployementType from './selectEmployementType';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daily Time Record',
        href: '/dtr',
    },
];

interface Props {
    offices: OfficeProps[];
    employees: PaginatedDataResponse<EmployeeProps>;
    employmentTypes: EmploymentTypeProps[];
    filters: FilterProps;
}
export default function DTR({ employmentTypes, employees, filters, offices }: Props) {
    const [openImport, setOpenImport] = useState(false);
    const [openFilterData, setOpenFilterData] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<number[]>([]);
    const isAllSelected = employees.data.every((emp) => selectedEmployee.includes(emp.id));

    const { data, setData } = useForm<{
        search: string;
        employment_type_id: number | null;
        date_from: Date | undefined;
        date_to: Date | undefined;
        selectedYear: string | null;
        selectedMonth: string | null;
        office_id: number | null;
    }>({
        search: filters.search || '',
        employment_type_id: filters.employment_type_id || 0,
        date_from: undefined as Date | undefined,
        date_to: undefined as Date | undefined,
        selectedYear: filters.selectedYear || '',
        selectedMonth: filters.selectedMonth || '',
        office_id: filters.office_id || 0,
    });

    const onChangeSelected = (id: number | 0) => {
        const isSameId = data.employment_type_id === id;

        const updatedData = {
            ...data,
            employment_type_id: isSameId ? null : id,
        };

        setData(updatedData);

        router.get(route('dtr.index'), updatedData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            router.get(route('dtr.index'), data, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedEmployee((prev) => prev.filter((id) => !employees.data.some((emp) => emp.id === id)));
        } else {
            const idsToAdd = employees.data.map((emp) => emp.id).filter((id) => !selectedEmployee.includes(id));

            setSelectedEmployee((prev) => [...prev, ...idsToAdd]);
        }
    };

    const handlClickCheckBox = (id: number) => {
        const updatedIds = selectedEmployee.includes(id) ? selectedEmployee.filter((idx) => idx !== id) : [...selectedEmployee, id];

        setSelectedEmployee(updatedIds);
    };

    const handleClickPrint = () => {
        const formattedDateFrom = data.date_from ? dayjs(data.date_from).format('YYYY-MM-DD') : undefined;
        const formattedDateTo = data.date_to ? dayjs(data.date_to).format('YYYY-MM-DD') : undefined;
        const url = route('dtr.print', {
            employee: selectedEmployee,
            selectedYear: data.selectedYear,
            selectedMonth: data.selectedMonth,
            date_from: formattedDateFrom,
            date_to: formattedDateTo,
        });

        window.open(url, '_blank');
    };

    const onChangeOffice = (officeId: number) => {
        const newOfficeId = data.office_id === officeId ? null : officeId;

        const updatedData = { ...data, office_id: newOfficeId };
        setData(updatedData);

        router.get(route('dtr.index'), updatedData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const onChangeMonth = (month: number) => {
        setData((prev) => ({ ...prev, selectedMonth: String(month) }));
    };

    const onChangeYear = (year: number) => {
        setData((prev) => ({ ...prev, selectedYear: String(year) }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DTR" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenFilterData(true)}>
                            <FilterIcon />
                            <span className="rounded-sm lg:inline">Filter Data</span>
                        </Button>

                        <SelectEmployementType value={data?.employment_type_id} onChange={onChangeSelected} employment_types={employmentTypes} />

                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenImport(true)}>
                            <HardDriveDownload />
                            <span className="rounded-sm lg:inline">Import Logs</span>
                        </Button>

                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleClickPrint}>
                            <Printer />
                            <span className="rounded-sm lg:inline">Print DTR</span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>
                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="w-[25px]">
                                    <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} className="border-white" />
                                </TableHead>
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
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedEmployee.includes(employee.id)}
                                                onCheckedChange={() => handlClickCheckBox(employee.id)}
                                            />
                                        </TableCell>
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
            {openImport && <ImportLogs open={openImport} setOpen={() => setOpenImport(false)} />}
            {openFilterData && (
                <FilterData
                    open={openFilterData}
                    setOpen={() => setOpenFilterData(false)}
                    offices={offices}
                    employmentTypes={employmentTypes}
                    onChangeOffice={onChangeOffice}
                    selectedOffice={Number(data.office_id)}
                    onChangeMonth={onChangeMonth}
                    selectedMonth={Number(data.selectedMonth)}
                    year={Number(data.selectedYear)}
                    onChangeYear={onChangeYear}
                />
            )}
        </AppLayout>
    );
}
