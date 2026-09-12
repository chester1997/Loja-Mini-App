"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="hidden md:flex fixed top-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent z-50 px-8 items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-xl font-bold tracking-wider text-red-600">
          STUDIO
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                Início
              </Link>
            </li>
            <li>
              <Link 
                href="/buscar" 
                className={`text-sm font-medium transition-colors ${pathname === "/buscar" ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                Buscar
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex items-center space-x-6 text-gray-400">
        <Link href="/buscar" className="hover:text-white transition-colors">
          <Search size={20} />
        </Link>
        <Link href="/favoritos" className="hover:text-white transition-colors">
          <Heart size={20} />
        </Link>
        <Link href="/compras" className="hover:text-white transition-colors">
          <ShoppingBag size={20} />
        </Link>
        <Link href="/conta" className="hover:text-white transition-colors">
          <User size={20} />
        </Link>
      </div>
    </header>
  );
}
