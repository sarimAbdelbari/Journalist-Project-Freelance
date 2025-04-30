import * as React from "react"
import {
  LayoutDashboard,
  BookOpen,
  PenSquare,
  Settings2,
  Users,
  FileText,
  Bell,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useStateContext } from "@/contexts/ContextProvider"

export function AppSidebar({ ...props }) {
  const { userInfo } = useStateContext()

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (userInfo?.role) {
      case 'journaliste':
        return [
          {
            title: "Dashboard",
            url: "/journaliste/dashboard",
            icon: LayoutDashboard,
            isActive: true,
          },
          {
            title: "My Articles",
            icon: PenSquare,
            // Remove the URL from parent item since it has children
            items: [
              {
                title: "All Articles",
                url: "/articles",
              },
              {
                title: "Create Article",
                url: "/dashboard/articles/create",
              },
              {
                title: "Published",
                url: "/articles/published",
              },
            ],
          },
          {
            title: "Settings",
            url: "/settings",
            icon: Settings2,
            items: [
              {
                title: "Profile",
                url: "/settings/profile",
              },
              {
                title: "Account",
                url: "/settings/account",
              },
              {}
            ],
          },
        ]
      case 'admin':
        return [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
          },
          {
            title: "Users",
            url: "/users",
            icon: Users,
          },
          {
            title: "Articles",
            url: "/articles",
            icon: FileText,
          },
          {
            title: "Settings",
            url: "/settings",
            icon: Settings2,
          },
        ]
      default:
        return []
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex w-full justify-center items-center h-24 transition-all duration-300 ease-in-out">
          <img 
            src="/assets/logoDark.png" 
            className="w-36 transition-all duration-300 ease-in-out [.collapsed_&]:w-8" 
            alt="logo" 
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={{
            name: userInfo?.username || 'Guest',
            email: userInfo?.email || '',
            avatar: userInfo?.avatar || '/assets/default-avatar.png'
          }} 
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
