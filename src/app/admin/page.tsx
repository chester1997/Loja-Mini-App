import { prisma } from "@/lib/prisma";
import { Users, Film, ShoppingCart, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const usersCount = await prisma.user.count();
  const contentsCount = await prisma.content.count();
  
  const purchases = await prisma.purchase.findMany({
    where: { status: "paid" },
    select: { amount: true }
  });

  const paidCount = purchases.length;
  const totalRevenue = purchases.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black border border-neutral-800 p-6 rounded-xl flex items-center">
          <div className="bg-blue-900/30 p-4 rounded-lg mr-4 text-blue-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Usuários</p>
            <p className="text-2xl font-bold">{usersCount}</p>
          </div>
        </div>

        <div className="bg-black border border-neutral-800 p-6 rounded-xl flex items-center">
          <div className="bg-purple-900/30 p-4 rounded-lg mr-4 text-purple-500">
            <Film size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Conteúdos</p>
            <p className="text-2xl font-bold">{contentsCount}</p>
          </div>
        </div>

        <div className="bg-black border border-neutral-800 p-6 rounded-xl flex items-center">
          <div className="bg-green-900/30 p-4 rounded-lg mr-4 text-green-500">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Vendas (Pagas)</p>
            <p className="text-2xl font-bold">{paidCount}</p>
          </div>
        </div>

        <div className="bg-black border border-neutral-800 p-6 rounded-xl flex items-center">
          <div className="bg-yellow-900/30 p-4 rounded-lg mr-4 text-yellow-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Faturamento</p>
            <p className="text-2xl font-bold">R$ {totalRevenue.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
