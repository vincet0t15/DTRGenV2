'use client';

import { MonthSelect } from '@/components/select-month';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmploymentTypeProps } from '@/types/employmentType';
import { OfficeProps } from '@/types/office';
import { ChangeEventHandler } from 'react';
import { SelectOffices } from '../Employee/selectOffice';

interface Props {
    offices: OfficeProps[];
    employmentTypes: EmploymentTypeProps[];
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedOffice: number;
    onChangeOffice: (officeId: number) => void;
    onChangeMonth: (month: number) => void;
    selectedMonth: number;
    year: number;
    onChangeYear: (year: number) => void;
}
export function FilterData({ open, setOpen, offices, onChangeOffice, selectedOffice, onChangeMonth, selectedMonth, year, onChangeYear }: Props) {
    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = Number(e.target.value);
        onChangeYear(value);
    };

    return (
        <Drawer open={open} direction="right" onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Filter Data</DrawerTitle>
                    <DrawerDescription>Fill out the form to register a new employee.</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Office</Label>
                            <SelectOffices offices={offices} onChange={onChangeOffice} dataValue={selectedOffice} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">For the month</Label>
                                <MonthSelect value={String(selectedMonth)} onChange={onChangeMonth} placeholder="Select month..." />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Year</Label>
                                <Input type="number" min={1} placeholder="Enter year" value={year === 0 ? '' : year} onChange={handleInputChange} />
                            </div>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button onClick={() => setOpen(false)} size={'sm'} className="cursor-pointer">
                        Close
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
