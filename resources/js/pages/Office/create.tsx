import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OfficeTypes } from '@/types/office';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEventHandler, FormEventHandler } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function OfficeCreate({ open, setOpen }: Props) {
    const { data, setData, processing, errors, post, reset } = useForm<OfficeTypes>({
        office_name: '',
        office_code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('office.store'), {
            onSuccess: (response: { props: FlashProps }) => {
                toast.success(response.props.flash?.success);
                reset();
                setOpen(false);
            },
        });
    };

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <form className="mt-4 flex flex-col gap-6" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create Office</DialogTitle>
                        <DialogDescription>Fill in the details below to create a office/department.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                placeholder="Enter office name"
                                className=""
                                onChange={handleInputChange}
                                value={data.office_name}
                                name="office_name"
                            />
                            <InputError message={errors.office_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Code</Label>
                            <Input placeholder="Enter code" className="" onChange={handleInputChange} value={data.office_code} name="office_code" />
                            <InputError message={errors.office_code} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="cursor-pointer" type="submit" disabled={processing} variant={'outline'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
