import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmployeeProps, EmployeeTypes } from '@/types/employee';
import { EmploymentTypeProps } from '@/types/employmentType';
import { OfficeProps } from '@/types/office';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';
import { SelectOffices } from './selectOffice';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    employeeData: EmployeeProps;
    employmentTypes: EmploymentTypeProps[];
    offices: OfficeProps[];
}
export default function EmployeeDrawer({ open, setOpen, employeeData, employmentTypes, offices }: Props) {
    console.log(employeeData);
    const { data, setData, put, reset, processing, errors } = useForm<EmployeeTypes>({
        name: employeeData.name || undefined,
        fingerprint_id: employeeData.fingerprint_id || 0,
        office_id: employeeData.office_id || 0,
        employment_type_id: employeeData.employment_type_id,
    });

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeEmploymentType = (data: string) => {
        setData((prev) => ({ ...prev, employment_type_id: Number(data) }));
    };

    const onChange = (officeId: number) => {
        setData((prev) => ({ ...prev, office_id: Number(officeId) }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('employee.update', employeeData.id), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };
    return (
        <div>
            <Drawer direction={'right'} open={open} onOpenChange={setOpen}>
                <DrawerContent className="flex h-full flex-col">
                    <DrawerHeader>
                        <DrawerTitle>Edit Employee</DrawerTitle>
                        <DrawerDescription>
                            Update the employee's information below. Make sure all details are accurate before saving.
                        </DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={submit} className="flex flex-1 flex-col justify-between">
                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <div className="flex flex-col gap-4 text-sm">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="header">Fullname</Label>
                                    <Input name="name" value={data.name} onChange={handleInputChange} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="header">Fingerprint ID</Label>
                                        <Input name="fingerprint_id" value={data.fingerprint_id} onChange={handleInputChange} />
                                        <InputError message={errors.fingerprint_id} />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="status">Employment Type</Label>
                                        <Select value={String(data.employment_type_id)} onValueChange={handleChangeEmploymentType}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {employmentTypes.map((data, index) => (
                                                        <SelectItem key={index} value={String(data.id)}>
                                                            {data.employment_type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.employment_type_id} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="reviewer">Office</Label>
                                    <SelectOffices offices={offices} onChange={onChange} dataValue={data.office_id} />
                                    <InputError message={errors.office_id} />
                                </div>
                            </div>
                        </div>

                        <DrawerFooter>
                            <Button className="cursor-pointer" type="submit" disabled={processing} variant={'outline'} size={'sm'}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create
                            </Button>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
