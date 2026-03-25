'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { useMockData } from '@/providers/MockDataProvider';
import { NAV_ITEMS } from '@/constants/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export const Header = () => {
  const { currentRole } = useMockData();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter((item) => item.roles.includes(currentRole));

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            BA
          </div>
          <span className="hidden font-semibold sm:inline-block">ClassesBA</span>
        </Link>

        <div className="hidden flex-1 max-w-md mx-auto md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search classes, studios..."
              className="pl-9 h-9"
              readOnly
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {visibleNav.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" render={<Link href={item.href} />}>
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-muted">
              {currentRole === 'guest' ? 'G' : 'MG'}
            </AvatarFallback>
          </Avatar>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="md:hidden inline-flex shrink-0 items-center justify-center rounded-lg h-8 w-8 hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex items-center justify-between border-b px-4 py-4">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  BA
                </div>
                <span className="font-semibold">ClassesBA</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-4 py-3">
              <RoleSwitcher />
            </div>
            <nav className="flex flex-col gap-1 px-2">
              {visibleNav.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="justify-start"
                  render={<Link href={item.href} />}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
