import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LayoutDashboard, Film, Folder, LayoutTemplate, ShoppingCart, Users, LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if (user?.role !== "ADMIN") {
    // If not admin, redirect to home or show denied
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-bold text-2xl">
        Acesso Restrito
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Conteúdos", href: "/admin/conteudos", icon: Film },
    { name: "Categorias", href: "/admin/categorias", icon: Folder },
    { name: "Home Layout", href: "/admin/home", icon: LayoutTemplate },
    { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
    { name: "Usuários", href: "/admin/usuarios", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-neutral-800 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-widest text-red-600">STUDIO ADMIN</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-neutral-800 transition">
                <Icon size={20} className="text-gray-400" />
                <span className="font-medium text-sm text-gray-300">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-neutral-800 transition text-gray-400">
            <LogOut size={20} />
            <span className="font-medium text-sm">Sair do Painel</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
