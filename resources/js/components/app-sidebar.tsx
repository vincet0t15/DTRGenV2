import { IconDashboard, IconDatabase, IconListDetails, IconReport } from '@tabler/icons-react';
import * as React from 'react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { Calendar1Icon } from 'lucide-react';

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: IconDashboard,
        },
        {
            title: 'Employee',
            url: '/employee',
            icon: IconListDetails,
        },
    ],

    documents: [
        {
            name: 'Offices',
            url: '/offices',
            icon: IconDatabase,
        },
        {
            name: 'Employment Type',
            url: '/employment-types',
            icon: IconReport,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a
                            href="#"
                            className="flex h-15 items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-white"
                        >
                            <Calendar1Icon className="!size-9 text-white" />
                            <div className="text-sm leading-tight">
                                <span className="block font-semibold uppercase">Daily Time Record</span>
                                <span className="block font-semibold tracking-wider">Generator</span>
                            </div>
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments className="" items={data.documents} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
