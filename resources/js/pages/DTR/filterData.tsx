'use client';

import InputError from '@/components/input-error';
import SelectEmploymentType from '@/components/select-employment-type';
import { MonthSelect } from '@/components/select-month';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmploymentTypeProps } from '@/types/employmentType';
import { OfficeProps } from '@/types/office';
import { useForm } from '@inertiajs/react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';
import { SelectOffices } from '../Employee/selectOffice';

interface Props {
    offices: OfficeProps[];
    employmentTypes: EmploymentTypeProps[];
    open: boolean;
    setOpen: (open: boolean) => void;
}
export function FilterData({ open, setOpen, offices, employmentTypes }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm<{
        name: string;
        fingerprint_id: number;
        office_id: number;
        employment_type_id: number;
        selectedMonth: number;
        selectedYear: number;
    }>({
        name: '',
        fingerprint_id: 0,
        office_id: 0,
        employment_type_id: 0,
        selectedMonth: 0,
        selectedYear: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data);
        post(route('employee.store'), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };

    const onChangeType = (id: string) => {
        setData((prev) => ({ ...prev, employment_type_id: Number(id) }));
    };

    const onChangeOffice = (id: number) => {
        setData((prev) => ({ ...prev, office_id: id }));
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onChangeMonth = (month: string) => {
        setData((prev) => ({ ...prev, selectedMonth: Number(month) }));
    };
    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add Employee</DrawerTitle>
                    <DrawerDescription>Fill out the form to register a new employee.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Office</Label>
                            <SelectOffices offices={offices} onChange={onChangeOffice} dataValue={data.office_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">For the month</Label>
                                <MonthSelect value={String(data.selectedMonth)} onChange={onChangeMonth} placeholder="Select month..." />
                                <InputError message={errors.fingerprint_id} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Year</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder="Enter year"
                                    name="selectedYear"
                                    value={data.selectedYear === 0 ? '' : data.selectedYear}
                                    onChange={handleInputChange}
                                />

                                <InputError message={errors.employment_type_id} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Employment Type</Label>
                            <SelectEmploymentType employmentTypes={employmentTypes} onChange={onChangeType} value={String(data.employment_type_id)} />
                            <InputError message={errors.office_id} />
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button onClick={submit} type="submit" size={'sm'} className="cursor-pointer">
                        Save
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
