import React from 'react'
import { BookDashed } from 'lucide-react'
import { useStateContext } from '@/contexts/ContextProvider'
import { Link } from 'react-router-dom'

import {DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { User } from 'lucide-react'
import { Settings } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { ModeToggle } from '../ui/mode-toggle'



const NavBar = () => {
  const { userInfo } = useStateContext()
  const { role } = userInfo || {}

  return (
    <header className="sticky top-2 mt-2.5 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <NavLogo />
        
        <div className="flex items-center gap-6">
          <NavMenu />
          <NavSearch />
          
          <div className="flex items-center gap-4">
            {(role === 'journaliste' || role === 'admin') && (
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <BookDashed className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            <UserMenu user={userInfo} />
          </div>
        </div>
      </div>
    </header>
  )
}

export function NavLogo() {
    return (
      <Link to="/" className="flex items-center space-x-2">
        <img 
          src="/assets/logoDark.png" 
          alt="Logo" 
          className="h-24 w-auto dark:invert"
        />
      </Link>
    )
  }

  export function NavMenu() {
    return (
      <nav className="hidden md:flex items-center gap-6">
        <Link 
          to="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Home
        </Link>
        <Link 
          to="/articles"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Articles
        </Link>
        <Link 
          to="/journalists"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Journalists
        </Link>
      </nav>
    )
  }

  export function NavSearch() {
    return (
      <div className="relative w-full max-w-sm lg:max-w-md">
        <Input
          type="search"
          placeholder="Search articles..."
          className="h-9 w-full bg-muted px-4 pl-9"
        />
        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
    )
  }

  export function UserMenu({ user }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl || 'assets/user.png'} alt={user?.name} />
              <AvatarFallback>
                {user?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />         
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

export default NavBar