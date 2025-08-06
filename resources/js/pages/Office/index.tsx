import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { FilterProps } from '@/types/filter';
import { OfficeProps } from '@/types/office';
import { PaginatedDataResponse } from '@/types/pagination';
import { Head, router, useForm } from '@inertiajs/react';
import { IconPlus } from '@tabler/icons-react';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import OfficeCreate from './create';
import DeleteOffice from './delete';
import EditOffice from './edit';
interface Props {
    offices: PaginatedDataResponse<OfficeProps>;
    filters: FilterProps;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];
export default function OfficeIndex({ offices, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [dataToEdit, setDataEdit] = useState<OfficeProps | null>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState<OfficeProps | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = data.search ? { search: data.search } : undefined;
            router.get(route('office.index'), queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleClickName = (data: OfficeProps) => {
        setDataEdit(data);
        setOpenEdit(true);
    };

    const handleClickDelete = (data: OfficeProps) => {
        setDataToDelete(data);
        setOpenDelete(true);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenCreate(true)}>
                        <IconPlus />
                        <span className="rounded-sm lg:inline">Office</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offices.data.length > 0 ? (
                                offices.data.map((office, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell className="cursor-pointer text-sm uppercase hover:font-bold hover:underline">
                                            <span onClick={() => handleClickName(office)}>{office.office_name}</span>
                                        </TableCell>
                                        <TableCell className="text-sm uppercase">{office.office_code}</TableCell>
                                        <TableCell className="text-sm">
                                            <span
                                                className="cursor-pointer hover:text-orange-700 hover:underline"
                                                onClick={() => handleClickDelete(office)}
                                            >
                                                Delete
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-3 text-center text-gray-500">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={offices} />
                </div>

                {openCreate && <OfficeCreate open={openCreate} setOpen={() => setOpenCreate(false)} />}
                {openEdit && dataToEdit && <EditOffice open={openEdit} setOpen={() => setOpenEdit(false)} dataToEdit={dataToEdit} />}
                {openDelete && dataToDelete && <DeleteOffice open={openDelete} setOpen={() => setOpenDelete(false)} dataToDelete={dataToDelete} />}
            </div>
        </AppLayout>
    );
}
