import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconChevronDown, IconLayoutColumns } from '@tabler/icons-react';
interface Props {
    selectedType: number[];
    setSelectedTypes: (type: number) => void;
}
export default function FilterType({ selectedType, setSelectedTypes }: Props) {
    const toggleType = (type: number) => {
        setSelectedTypes(type);
    };
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                        <IconLayoutColumns className="mr-2" />
                        Filter
                        <IconChevronDown className="ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={selectedType.includes(1)} onCheckedChange={() => toggleType(1)}>
                        Plantilla
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={selectedType.includes(0)} onCheckedChange={() => toggleType(0)}>
                        COS/JOS
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
