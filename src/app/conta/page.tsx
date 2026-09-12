import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingBag, History, Settings, LogOut, PlaySquare } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex flex-col w-full min-h-screen p-6 md:p-12 max-w-4xl mx-auto">
      <div className="flex items-center space-x-6 mb-10">
        <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-neutral-700">
          {session.user.email?.[0].toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{session.user.name || "Usuário"}</h1>
          <p className="text-gray-400">{session.user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/favoritos" className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-center hover:bg-neutral-800 transition">
          <Heart className="mr-4 text-red-500" size={24} />
          <div>
            <h2 className="font-semibold text-lg">Minha Lista</h2>
            <p className="text-sm text-gray-500">Conteúdos que você salvou</p>
          </div>
        </Link>

        <Link href="/compras" className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-center hover:bg-neutral-800 transition">
          <ShoppingBag className="mr-4 text-green-500" size={24} />
          <div>
            <h2 className="font-semibold text-lg">Minhas Compras</h2>
            <p className="text-sm text-gray-500">Conteúdos que você adquiriu</p>
          </div>
        </Link>

        <Link href="/conta/historico" className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-center hover:bg-neutral-800 transition">
          <History className="mr-4 text-blue-500" size={24} />
          <div>
            <h2 className="font-semibold text-lg">Histórico</h2>
            <p className="text-sm text-gray-500">O que você andou assistindo</p>
          </div>
        </Link>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-center hover:bg-neutral-800 transition cursor-pointer">
          <Settings className="mr-4 text-gray-400" size={24} />
          <div>
            <h2 className="font-semibold text-lg">Configurações</h2>
            <p className="text-sm text-gray-500">Gerenciar conta e senha</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/api/auth/signout" className="flex items-center text-red-500 hover:text-red-400 font-semibold p-4">
          <LogOut className="mr-2" size={20} />
          Sair da Conta
        </Link>
      </div>
    </div>
  );
}
