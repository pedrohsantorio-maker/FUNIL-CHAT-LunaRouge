"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  MessageSquare,
  LayoutDashboard,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FirebaseClientProvider } from "@/firebase/client-provider";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Visão Geral" },
  { href: "/admin/users", icon: Users, label: "Leads" },
  { href: "/admin/conversations", icon: MessageSquare, label: "Conversas" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = (
    <nav className="grid gap-1 p-2">
      <TooltipProvider>
        {navItems.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname.startsWith(item.href) && "bg-muted font-bold"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </nav>
  );

  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
          <div className="border-b p-4">
            <h2 className="text-xl font-bold">Painel Admin</h2>
          </div>
          {navLinks}
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <div className="border-b p-4">
                  <h2 className="text-xl font-bold">Painel Admin</h2>
                </div>
                {navLinks}
              </SheetContent>
            </Sheet>
            <h1 className="flex-1 text-xl font-semibold">
              {navItems.find((item) => pathname.startsWith(item.href))?.label}
            </h1>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
