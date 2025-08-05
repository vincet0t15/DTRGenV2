import { AppSidebar } from '@/components/app-sidebar';
import Pagination from '@/components/paginationData';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmployeeProps } from '@/types/employee';
import { FilterProps } from '@/types/filter';
import { PaginatedDataResponse } from '@/types/pagination';
import { router, useForm } from '@inertiajs/react';
import { IconCircle, IconPlus } from '@tabler/icons-react';
import { HardDriveDownload } from 'lucide-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import FilterType from './filterType';
import ImportEmployee from './importEmployee';
import EmployeeChangeStatus from './status';
interface Props {
    employees: PaginatedDataResponse<EmployeeProps>;
    filters: FilterProps;
}
export default function Page({ employees, filters }: Props) {
    const [openImport, setOpenImport] = useState(false);
    const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
    const [dataToUpdateStatus, setDataToUpdateStatus] = useState<EmployeeProps | null>(null);

    const { data, setData } = useForm({
        search: filters.search || '',
        filterTypes: (filters?.filterTypes || []).map(Number),
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            router.get(
                route('employee.index'),
                {
                    search: data.search,
                    'filterTypes[]': data.filterTypes,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleClickUpdateStatus = (data: EmployeeProps) => {
        setDataToUpdateStatus(data);
        setOpenUpdateStatus(true);
    };

    const onChangeSelected = (type: number) => {
        const updatedFilterTypes = data.filterTypes.includes(type) ? data.filterTypes.filter((t) => t !== type) : [...data.filterTypes, type];

        setData('filterTypes', updatedFilterTypes);

        router.get(route('employee.index'), {
            search: data.search,
            'filterTypes[]': updatedFilterTypes,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader title="Employee" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6">
                            <div className="flex w-full flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        <IconPlus />
                                        <span className="rounded-sm lg:inline">Employee</span>
                                    </Button>
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        <HardDriveDownload />
                                        <span
                                            className="rounded-sm lg:inline"
                                            onClick={() => {
                                                requestAnimationFrame(() => setOpenImport(true));
                                            }}
                                        >
                                            Import
                                        </span>
                                    </Button>
                                    <FilterType setSelectedTypes={onChangeSelected} selectedType={data.filterTypes} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                                </div>
                            </div>

                            <div className="px-4 lg:px-6">
                                <div className="w-full space-y-6">
                                    <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                                        <Table>
                                            <TableHeader className="bg-muted">
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Office</TableHead>
                                                    <TableHead className="">Status</TableHead>
                                                    <TableHead className="">Type</TableHead>
                                                    <TableHead className="text-center">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {employees.data.length > 0 ? (
                                                    employees.data.map((employee, index) => (
                                                        <TableRow key={index} className="text-sm">
                                                            <TableCell className="text-sm">{employee.name}</TableCell>
                                                            <TableCell className="text-sm">{employee.office.office_name}</TableCell>
                                                            <TableCell>
                                                                {employee.is_active ? (
                                                                    <Badge variant="outline">
                                                                        <IconCircle className="fill-green-500 dark:fill-green-400" />
                                                                        Done
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline">
                                                                        <IconCircle className="dark:fill-orange-700" />
                                                                        Inactive
                                                                    </Badge>
                                                                )}
                                                            </TableCell>

                                                            <TableCell className="text-sm">
                                                                {employee.is_permanent ? 'Plantilla' : 'COS/JO'}
                                                            </TableCell>
                                                            <TableCell className="text-center text-sm">
                                                                <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                                                                    <Label className="cursor-pointer text-green-700 hover:underline">Edit</Label>
                                                                    <span className="hidden sm:inline">|</span>
                                                                    <Label
                                                                        className="cursor-pointer hover:underline"
                                                                        onClick={() => handleClickUpdateStatus(employee)}
                                                                    >
                                                                        {employee.is_active ? (
                                                                            <span className="text-teal-700">Active</span>
                                                                        ) : (
                                                                            <span className="text-orange-400">Inactive</span>
                                                                        )}
                                                                    </Label>
                                                                    <span className="hidden sm:inline">|</span>
                                                                    <Label className="cursor-pointer text-red-600 hover:underline">Delete</Label>
                                                                </div>
                                                            </TableCell>
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
                            </div>
                        </div>
                    </div>
                </div>
                {openImport && <ImportEmployee open={openImport} setOpen={() => setOpenImport(false)} />}
                {openUpdateStatus && dataToUpdateStatus && (
                    <EmployeeChangeStatus open={openUpdateStatus} setOpen={() => setOpenUpdateStatus(false)} dataToChange={dataToUpdateStatus} />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
