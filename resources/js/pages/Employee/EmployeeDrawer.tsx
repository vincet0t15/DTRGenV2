import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function EmployeeDrawer({ open, setOpen }: Props) {
    return (
        <div>
            <Drawer direction={'right'} open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Edit Employee</DrawerTitle>
                        <DrawerDescription>
                            Update the employee's information below. Make sure all details are accurate before saving.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 overflow-y-auto p-7 px-4 text-sm">
                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Fullname</Label>
                                <Input id="header" defaultValue={'hello'} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="header">Fingerprint ID</Label>
                                    <Input id="header" defaultValue={'hello'} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="status">Status</Label>
                                    <Select defaultValue={'Done'}>
                                        <SelectTrigger id="status" className="w-full">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Done">Done</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Not Started">Not Started</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Type</Label>
                                <Select defaultValue={'Eddie Lake'}>
                                    <SelectTrigger id="reviewer" className="w-full">
                                        <SelectValue placeholder="Select a reviewer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                                        <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                                        <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="reviewer">Office</Label>
                                <Select defaultValue={'Eddie Lake'}>
                                    <SelectTrigger id="reviewer" className="w-full">
                                        <SelectValue placeholder="Select a reviewer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                                        <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                                        <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </form>
                    </div>

                    <DrawerFooter>
                        <Button className="cursor-pointer rounded-sm" size={'sm'}>
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
