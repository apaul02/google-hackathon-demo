'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BotIcon, Stethoscope, TrendingUp, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Disease Diagnosis', href: '/chat', icon: Stethoscope },
    { name: 'Market', href: '/chart', icon: TrendingUp },
    { name: 'Government Schemes', href: '/policy', icon: FileText },
  ];

  return (
    <header className="flex items-center justify-between bg-background/80 backdrop-blur-sm px-4 py-2 border-b fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer" onClick={() => router.push('/')}>
          Kisan Sathi
        </h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex items-center space-x-1 bg-gray-200 rounded-xl border-2 p-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2 py-3 px-6 rounded-lg transition-all duration-200 font-medium',
                isActive
                  ? 'bg-white text-black border shadow'
                  : 'text-black hover:scale-105'
              )}
            >
              <IconComponent size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Get Started Button */}
      <div>
        <Avatar>
            <AvatarImage src="https://github.com/apaul02.png" />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
      </div>
    </header>
  );
}