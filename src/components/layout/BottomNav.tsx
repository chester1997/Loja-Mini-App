"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Início", href: "/", icon: Home },
    { name: "Buscar", href: "/buscar", icon: Search },
    { name: "Favoritos", href: "/favoritos", icon: Heart },
    { name: "Compras", href: "/compras", icon: ShoppingBag },
    { name: "Conta", href: "/conta", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-black/90 backdrop-blur-md border-t border-white/10 z-50 px-2 py-2">
      <ul className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.name} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 w-full h-full p-2 transition-colors duration-200 ${
                  isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
