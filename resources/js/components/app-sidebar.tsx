import { IconDashboard, IconDatabase, IconListDetails, IconReport } from '@tabler/icons-react';
import * as React from 'react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';

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
                    <SidebarMenuItem className="text-center">
                        <div className="text-sm leading-tight">
                            <span className="block text-2xl font-semibold uppercase">Daily Time Record</span>
                            <span className="block text-[16px] font-semibold tracking-wider">Generator</span>
                        </div>
                    </SidebarMenuItem>
                    <hr />
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
