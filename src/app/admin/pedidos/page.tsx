import { prisma } from "@/lib/prisma";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default async function AdminOrders() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      content: true,
    }
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid': return <span className="flex items-center text-green-500 bg-green-900/30 px-2 py-1 rounded text-xs font-semibold"><CheckCircle2 size={12} className="mr-1"/> Pago</span>;
      case 'pending': return <span className="flex items-center text-yellow-500 bg-yellow-900/30 px-2 py-1 rounded text-xs font-semibold"><Clock size={12} className="mr-1"/> Pendente</span>;
      default: return <span className="flex items-center text-red-500 bg-red-900/30 px-2 py-1 rounded text-xs font-semibold"><XCircle size={12} className="mr-1"/> {status}</span>;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Pedidos / Compras</h1>

      <div className="bg-black border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800">
            <tr>
              <th className="p-4 text-gray-400 font-medium">Data</th>
              <th className="p-4 text-gray-400 font-medium">Usuário</th>
              <th className="p-4 text-gray-400 font-medium">Conteúdo</th>
              <th className="p-4 text-gray-400 font-medium">Valor</th>
              <th className="p-4 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id} className="border-b border-neutral-800 hover:bg-neutral-900/50">
                <td className="p-4 text-sm">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</td>
                <td className="p-4 font-medium">{p.user.email}</td>
                <td className="p-4 text-gray-300">{p.content.title}</td>
                <td className="p-4 font-bold">R$ {Number(p.amount || 0).toFixed(2)}</td>
                <td className="p-4">{getStatusBadge(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {purchases.length === 0 && (
          <div className="p-8 text-center text-gray-500">Nenhum pedido encontrado.</div>
        )}
      </div>
    </div>
  );
}
