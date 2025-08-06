'use client';

import { type Icon } from '@tabler/icons-react';

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function NavDocuments({
    items,
    ...props
}: {
    items: {
        name: string;
        url: string;
        icon: Icon;
    }[];
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
