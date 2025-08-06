'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeTypes } from '@/types/employee';
import { useForm } from '@inertiajs/react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export function FilterData({ open, setOpen }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm<EmployeeTypes>({
        name: '',
        fingerprint_id: 0,
        office_id: 0,
        employment_type_id: 0,
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

    const onChangeType = (id: number) => {
        setData((prev) => ({ ...prev, employment_type_id: id }));
    };

    const onChangeOffice = (id: number) => {
        setData((prev) => ({ ...prev, office_id: id }));
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                            <Label htmlFor="header">Name</Label>
                            <Input placeholder="Enter employee name" name="name" value={data.name} onChange={handleInputChange} />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Fingerprint ID</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter fingerprint ID"
                                    name="fingerprint_id"
                                    value={data.fingerprint_id}
                                    onChange={handleInputChange}
                                />
                                <InputError message={errors.fingerprint_id} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Employement Type</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter fingerprint ID"
                                    name="fingerprint_id"
                                    value={data.fingerprint_id}
                                    onChange={handleInputChange}
                                />
                                <InputError message={errors.employment_type_id} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Office</Label>
                            <Input
                                type="number"
                                placeholder="Enter fingerprint ID"
                                name="fingerprint_id"
                                value={data.fingerprint_id}
                                onChange={handleInputChange}
                            />
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
